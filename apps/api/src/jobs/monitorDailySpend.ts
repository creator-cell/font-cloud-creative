import { Types } from "mongoose";
import TokenTransactionModel from "../models/TokenTransaction";
import { createSystemAlert } from "../services/systemAlertService";
import { Guardrails } from "../config/guardrails";

const HOURS_24 = 24 * 60 * 60 * 1000;
const DAYS_7 = 7 * HOURS_24;

type SpendAggregation = {
  _id: Types.ObjectId;
  total24h: number;
  total7d: number;
};

export async function monitorDailySpend(): Promise<void> {
  const now = Date.now();
  const dayAgo = new Date(now - HOURS_24);
  const sevenDaysAgo = new Date(now - DAYS_7);

  const aggregates = await TokenTransactionModel.aggregate<SpendAggregation>([
    {
      $match: {
        type: "spend",
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $project: {
        userId: "$userId",
        amountTokens: "$amountTokens",
        createdAt: "$createdAt",
        within24h: { $gte: ["$createdAt", dayAgo] }
      }
    },
    {
      $group: {
        _id: "$userId",
        total24h: {
          $sum: {
            $cond: ["$within24h", "$amountTokens", 0]
          }
        },
        total7d: { $sum: "$amountTokens" }
      }
    }
  ]);

  await Promise.all(
    aggregates.map(async ({ _id, total24h, total7d }) => {
      if (total24h <= 0) {
        return;
      }

      const avgDaily = total7d / 7;
      if (avgDaily <= 0) {
        return;
      }

      const threshold = avgDaily * Guardrails.MAX_DAILY_SPEND_MULTIPLIER;
      if (total24h <= threshold) {
        return;
      }

      const deltaPct = ((total24h - avgDaily) / avgDaily) * 100;

      await createSystemAlert({
        type: "spend_spike",
        severity: "medium",
        userId: _id,
        meta: {
          total24h,
          avgDaily,
          threshold,
          deltaPct
        }
      });
    })
  );
}
