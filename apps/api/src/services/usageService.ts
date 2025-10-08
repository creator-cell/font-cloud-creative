import { Types } from "mongoose";
import { env } from "../config/env";
import { UsageModel, type UsageDocument, TokenPolicyOverrideModel } from "../models";
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
}> => {
  const usage = await getUsageForUser(userId);
  const quota = await getEffectiveQuota(userId, plan, usage.monthKey);
  return {
    monthKey: usage.monthKey,
    tokensIn: usage.tokensIn,
    tokensOut: usage.tokensOut,
    generations: usage.generations,
    quota,
    softWarned: usage.softWarned
  };
};
