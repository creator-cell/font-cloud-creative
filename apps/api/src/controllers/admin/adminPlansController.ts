// @ts-nocheck
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/express.js";
import { PlanModel } from "../../models/index.js";
import { planUpsertSchema } from "../../schemas/adminSchemas.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditService } from "../../services/auditService.js";

export const listPlans = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const plans = await PlanModel.find().sort({ monthlyTokens: 1 }).lean().exec();
  res.json({ plans });
});

export const getPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const plan = await PlanModel.findById(id).lean().exec();

  if (!plan) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }

  res.json({ plan });
});

export const createPlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = planUpsertSchema.parse(req.body);

  const existing = await PlanModel.findOne({ key: payload.key }).lean().exec();
  if (existing) {
    res.status(409).json({ error: "Plan with this key already exists." });
    return;
  }

  const plan = await PlanModel.create(payload);

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "create-plan",
    entityType: "plan",
    entityId: plan._id,
    meta: { key: plan.key, price: plan.monthlyPriceINR },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(201).json({ plan });
});

export const updatePlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = planUpsertSchema.parse(req.body);
  const { id } = req.params;

  const plan = await PlanModel.findByIdAndUpdate(id, payload, { new: true }).exec();

  if (!plan) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "update-plan",
    entityType: "plan",
    entityId: plan._id,
    meta: { key: plan.key, price: plan.monthlyPriceINR },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.json({ plan });
});

export const deletePlan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const plan = await PlanModel.findByIdAndDelete(id).exec();

  if (!plan) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "delete-plan",
    entityType: "plan",
    entityId: plan._id,
    meta: { key: plan.key, price: plan.monthlyPriceINR },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(204).send();
});
