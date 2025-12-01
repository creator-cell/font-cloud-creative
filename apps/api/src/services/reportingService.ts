import { endOfDay, startOfDay, subDays } from "date-fns";
import { DailyMetricsModel, GenerationModel, PlanModel, UserModel } from "../models/index.js";

export const reportingService = {
  async refreshDailyMetrics(target: Date = new Date()): Promise<void> {
    const dayStart = startOfDay(target);
    const dayEnd = endOfDay(target);

    const [dauIds, wauIds, mauIds] = await Promise.all([
      GenerationModel.distinct("userId", { createdAt: { $gte: dayStart, $lte: dayEnd } }),
      GenerationModel.distinct("userId", {
        createdAt: { $gte: subDays(dayEnd, 6), $lte: dayEnd }
      }),
      GenerationModel.distinct("userId", {
        createdAt: { $gte: subDays(dayEnd, 29), $lte: dayEnd }
      })
    ]);

    const tokenAggregation = await GenerationModel.aggregate<{
      _id: { provider: string };
      tokensIn: number;
      tokensOut: number;
    }>([
      {
        $match: {
          createdAt: { $gte: dayStart, $lte: dayEnd }
        }
      },
      {
        $group: {
          _id: { provider: "$provider" },
          tokensIn: { $sum: "$tokensIn" },
          tokensOut: { $sum: "$tokensOut" }
        }
      }
    ]);

    const tokensInByProvider: Record<string, number> = {};
    const tokensOutByProvider: Record<string, number> = {};
    tokenAggregation.forEach((row) => {
      tokensInByProvider[row._id.provider] = row.tokensIn;
      tokensOutByProvider[row._id.provider] = row.tokensOut;
    });

    const planDocs = await PlanModel.find({}).lean().exec();
    const priceMap = new Map<string, number>(planDocs.map((plan) => [plan.key, plan.monthlyPriceINR]));

    const users = await UserModel.find({}).select({ plan: 1 }).lean().exec();
    const planMix: Record<string, number> = {};
    let mrr = 0;

    users.forEach((user) => {
      planMix[user.plan] = (planMix[user.plan] ?? 0) + 1;
      const price = priceMap.get(user.plan);
      if (price && user.plan !== "free") {
        mrr += price;
      }
    });

    const arr = mrr * 12;
    const activePaid = users.filter((user) => user.plan !== "free").length;
    const arpu = users.length > 0 ? mrr / users.length : 0;

    const newSignups = await UserModel.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd }
    });

    await DailyMetricsModel.findOneAndUpdate(
      { date: dayStart },
      {
        date: dayStart,
        dau: dauIds.length,
        wau: wauIds.length,
        mau: mauIds.length,
        newSignups,
        activePaid,
        mrr,
        arr,
        arpu,
        churn: 0,
        tokensInByProvider,
        tokensOutByProvider,
        planMix
      },
      { upsert: true, new: true }
    );
  }
};
