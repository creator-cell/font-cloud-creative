import { Types } from "mongoose";
import { env } from "../config/env";
import {
  UsageModel,
  type UsageDocument,
  TokenPolicyOverrideModel,
  WalletModel,
  TokenTransactionModel
} from "../models";
import type { PlanTier } from "../constants/plans";

export const getMonthKey = (date: Date = new Date()): string =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const quotaForPlan = (plan: PlanTier): number => env.quotas[plan];

const getEffectiveQuota = async (userId: string, plan: PlanTier, monthKey: string): Promise<number> => {
  const override = await TokenPolicyOverrideModel.findOne({
    userId: new Types.ObjectId(userId),
    monthKey
  })
    .lean()
    .exec();

  const bonus = override && override.expiresAt > new Date() ? override.extraTokens : 0;
  return quotaForPlan(plan) + bonus;
};

const getOrCreateUsage = async (userId: string, monthKey: string): Promise<UsageDocument> => {
  const objectId = new Types.ObjectId(userId);
  const usage = await UsageModel.findOneAndUpdate(
    { userId: objectId, monthKey },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return usage;
};

export const getUsageForUser = async (userId: string, monthKey = getMonthKey()): Promise<UsageDocument> =>
  getOrCreateUsage(userId, monthKey);

const getMonthDateRange = (monthKey: string): { start: Date; end: Date } => {
  const [year, month] = monthKey.split("-").map((value) => Number.parseInt(value, 10));
  const start = new Date(Date.UTC(year, (month || 1) - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, (month || 1), 1, 0, 0, 0, 0));
  return { start, end };
};

export const bumpUsage = async (
  userId: string,
  plan: PlanTier,
  tokensIn: number,
  tokensOut: number
): Promise<UsageDocument> => {
  const monthKey = getMonthKey();
  const usage = await getOrCreateUsage(userId, monthKey);
  usage.tokensIn += tokensIn;
  usage.tokensOut += tokensOut;
  usage.generations += 1;

  const quota = await getEffectiveQuota(userId, plan, monthKey);
  const total = usage.tokensIn + usage.tokensOut;
  if (!usage.softWarned && quota > 0 && total / quota >= 0.8) {
    usage.softWarned = true;
  }

  await usage.save();
  return usage;
};

export const assertWithinQuota = async (userId: string, plan: PlanTier): Promise<void> => {
  const usage = await getUsageForUser(userId);
  const total = usage.tokensIn + usage.tokensOut;
  const quota = await getEffectiveQuota(userId, plan, usage.monthKey);
  if (quota > 0 && total >= quota) {
    const error = new Error("Monthly quota exceeded");
    (error as Error & { status?: number }).status = 402;
    throw error;
  }
};

export const getUsageSummary = async (
  userId: string,
  plan: PlanTier
): Promise<{
  monthKey: string;
  tokensIn: number;
  tokensOut: number;
  generations: number;
  quota: number;
  softWarned: boolean;
  availableTokens: number;
  holdTokens: number;
  totalAllocatedTokens: number;
  rechargeCount: number;
  rechargeTokens: number;
  tokenBalance: number;
  walletCurrency: string;
}> => {
  const usage = await getUsageForUser(userId);
  const userObjectId = new Types.ObjectId(userId);
  const { start, end } = getMonthDateRange(usage.monthKey);

  const [quota, wallet, monthlyGrantAgg, monthlyRechargeAgg] = await Promise.all([
    getEffectiveQuota(userId, plan, usage.monthKey),
    WalletModel.findOne({ userId: userObjectId }).lean().exec(),
    TokenTransactionModel.aggregate<{ total: number }>([
      {
        $match: {
          userId: userObjectId,
          type: "grant",
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountTokens" }
        }
      }
    ]),
    TokenTransactionModel.aggregate<{ total: number; count: number }>([
      {
        $match: {
          userId: userObjectId,
          type: "grant",
          source: "recharge",
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountTokens" },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const tokensIn = usage.tokensIn;
  const tokensOut = usage.tokensOut;
  const tokenBalance = wallet?.tokenBalance ?? 0;
  const holdTokens = wallet?.holdAmount ?? 0;
  const totalAllocatedTokens = monthlyGrantAgg[0]?.total ?? quota;
  const rechargeStats = monthlyRechargeAgg[0] ?? { total: 0, count: 0 };
  const availableTokens = tokenBalance;

  return {
    monthKey: usage.monthKey,
    tokensIn,
    tokensOut,
    generations: usage.generations,
    quota: totalAllocatedTokens || quota,
    softWarned: usage.softWarned,
    availableTokens,
    holdTokens,
    totalAllocatedTokens: totalAllocatedTokens || quota,
    rechargeCount: rechargeStats.count ?? 0,
    rechargeTokens: rechargeStats.total ?? 0,
    tokenBalance,
    walletCurrency: wallet?.currency ?? "INR"
  };
};
