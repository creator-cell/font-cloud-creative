import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { PlanModel } from "../models";
import { planUpsertSchema } from "../schemas/adminSchemas";
import { asyncHandler } from "../utils/asyncHandler";
import { auditService } from "../services/auditService";

export const listPlans = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const plans = await PlanModel.find().sort({ monthlyTokens: 1 }).lean().exec();
  res.json({ plans });
});

export const upsertPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = planUpsertSchema.parse(req.body);
  const plan = await PlanModel.findOneAndUpdate({ key: payload.key }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "upsert-plan",
    entityType: "plan",
    entityId: plan._id,
    meta: { key: plan.key, price: plan.monthlyPriceINR },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(201).json({ plan });
});
