import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../../types/express";
import { UserModel, SubscriptionModel, PlanModel, TokenPolicyOverrideModel } from "../../models";
import { stripe } from "../../config/stripe";
import { setPlanSchema, grantTokensSchema } from "../../schemas/adminSchemas";
import { asyncHandler } from "../../utils/asyncHandler";
import { auditService } from "../../services/auditService";
import { env } from "../../config/env";
import { endOfMonth, parseISO } from "date-fns";

const ensurePlanExists = async (plan: string) => {
  const planDoc = await PlanModel.findOne({ key: plan }).lean().exec();
  if (!planDoc) {
    throw Object.assign(new Error(`Plan ${plan} is not configured`), { status: 400 });
  }
  return planDoc;
};

export const setUserPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { plan, seats } = setPlanSchema.parse(req.body);
  const userId = req.params.id;

  if (!Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const planDoc = await ensurePlanExists(plan);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      plan,
      ...(typeof seats === "number" ? { seats } : {})
    },
    { new: true }
  );

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const subscription = await SubscriptionModel.findOne({ userId: user._id });
  if (subscription) {
    subscription.plan = plan;
    subscription.status = plan === "free" ? "canceled" : subscription.status;
    await subscription.save();

    if (stripe && planDoc.stripePriceId && subscription.stripeSubscriptionId) {
      const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      const itemId = stripeSub.items.data[0]?.id;
      if (itemId) {
        await stripe.subscriptions.update(stripeSub.id, {
          items: [
            {
              id: itemId,
              price: planDoc.stripePriceId,
              quantity: seats ?? 1
            }
          ]
        });
      }
    }
  }

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "set-plan",
    entityType: "user",
    entityId: user._id,
    meta: { plan, seats },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.json({ user });
});

export const grantTokens = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = grantTokensSchema.parse(req.body);
  const userId = req.params.id;

  if (!Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const monthKey = payload.monthKey;
  const expiresAt = endOfMonth(payload.monthKey ? parseISO(`${payload.monthKey}-01`) : new Date());

  const override = await TokenPolicyOverrideModel.findOneAndUpdate(
    { userId: user._id, monthKey },
    {
      userId: user._id,
      monthKey,
      extraTokens: payload.extraTokens,
      expiresAt,
      reason: payload.reason
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "grant-tokens",
    entityType: "user",
    entityId: user._id,
    meta: { extraTokens: payload.extraTokens, monthKey },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(201).json({ override });
});

export const getUsageQuota = (plan: string): number => env.quotas[plan as keyof typeof env.quotas] ?? env.quotas.free;
