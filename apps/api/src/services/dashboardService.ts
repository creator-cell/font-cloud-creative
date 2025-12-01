// @ts-nocheck
import { Types } from "mongoose";
import { getUsageSummary } from "./usageService.js";
import { BrandVoiceModel, ProjectModel } from "../models/index.js";
import WalletModel from "../models/Wallet.js";
import type { PlanTier } from "../constants/plans.js";

export const getDashboardSummary = async (
  userId: string,
  plan: PlanTier
) => {
  const usage = await getUsageSummary(userId, plan);
  const userObjectId = new Types.ObjectId(userId);

  const projectsCount = await fetchProjectsCount(userObjectId, userId);
  const brandVoicesCount = await fetchBrandVoicesCount(userObjectId, userId);
  const walletBalance = await fetchWalletBalance(userObjectId, userId);

  const totalTokensUsed = usage.tokensIn + usage.tokensOut;
  const usagePercent = usage.quota > 0 ? Math.min((totalTokensUsed / usage.quota) * 100, 100) : 0;

  return {
    ...usage,
    usagePercent,
    projectsCount,
    brandVoicesCount,
    availableTokens: walletBalance
  };
};

async function fetchProjectsCount(userObjectId: Types.ObjectId, userId: string): Promise<number> {
  try {
    return await ProjectModel.countDocuments({ userId: userObjectId }).exec();
  } catch (error) {
    console.error("[dashboard] failed to count projects", { userId, error });
    return 0;
  }
}

async function fetchBrandVoicesCount(userObjectId: Types.ObjectId, userId: string): Promise<number> {
  try {
    return await BrandVoiceModel.countDocuments({ userId: userObjectId }).exec();
  } catch (error) {
    console.error("[dashboard] failed to count brand voices", { userId, error });
    return 0;
  }
}

async function fetchWalletBalance(userObjectId: Types.ObjectId, userId: string): Promise<number> {
  try {
    const wallet = await WalletModel.findOne({ userId: userObjectId }).lean().exec();
    return wallet?.tokenBalance ?? 0;
  } catch (error) {
    console.error("[dashboard] failed to load wallet", { userId, error });
    return 0;
  }
}
