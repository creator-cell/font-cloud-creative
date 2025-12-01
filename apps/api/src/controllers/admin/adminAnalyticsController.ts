import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../../types/express.js";
import { kpiService } from "../../services/kpiService.js";
import { UsageModel } from "../../models/index.js";
import { env } from "../../config/env.js";
import { DailyMetricsModel } from "../../models/DailyMetrics.js";
import { PlanModel, UserModel } from "../../models/index.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { topUsersQuerySchema } from "../../schemas/adminSchemas.js";

export const getOverview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const range = (req.query.range as "7d" | "30d" | "90d" | undefined) ?? "30d";
  const overview = await kpiService.getOverview({ range });
  res.json(overview);
});

export const getTopUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { limit = 50 } = topUsersQuerySchema.parse(req.query);
  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  const usage = await UsageModel.aggregate([
    { $match: { monthKey } },
    {
      $addFields: {
        totalTokens: { $add: ["$tokensIn", "$tokensOut"] }
      }
    },
    { $sort: { totalTokens: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$userId",
        totalTokens: 1,
        tokensIn: "$tokensIn",
        tokensOut: "$tokensOut",
        plan: "$user.plan",
        email: "$user.email"
      }
    }
  ]);

  const response = usage.map((entry) => {
    const quota = env.quotas[entry.plan as keyof typeof env.quotas] ?? env.quotas.free;
    return {
      userId: (entry.userId as Types.ObjectId).toHexString(),
      email: entry.email,
      plan: entry.plan,
      tokensIn: entry.tokensIn,
      tokensOut: entry.tokensOut,
      totalTokens: entry.totalTokens,
      overLimit: entry.totalTokens >= quota
    };
  });

  res.json({ monthKey, users: response });
});

export const getMRR = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const latestMetrics = await DailyMetricsModel.find().sort({ date: -1 }).limit(1).lean().exec();
  if (latestMetrics[0]) {
    res.json({
      mrr: latestMetrics[0].mrr,
      arr: latestMetrics[0].arr,
      planMix: latestMetrics[0].planMix
    });
    return;
  }

  const plans = await PlanModel.find().lean().exec();
  const priceMap = new Map(plans.map((plan) => [plan.key, plan.monthlyPriceINR]));
  const users = await UserModel.find().select({ plan: 1 }).lean().exec();
  let mrr = 0;
  const planMix: Record<string, number> = {};
  users.forEach((user) => {
    planMix[user.plan] = (planMix[user.plan] ?? 0) + 1;
    const price = priceMap.get(user.plan);
    if (price && user.plan !== "free") {
      mrr += price;
    }
  });

  res.json({ mrr, arr: mrr * 12, planMix });
});
