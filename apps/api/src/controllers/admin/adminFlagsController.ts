// @ts-nocheck
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/express.js";
import { FeatureFlagModel } from "../../models/index.js";
import { featureFlagUpsertSchema } from "../../schemas/adminSchemas.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditService } from "../../services/auditService.js";

export const upsertFeatureFlag = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = featureFlagUpsertSchema.parse(req.body);

  const doc = await FeatureFlagModel.findOneAndUpdate(
    { key: payload.key },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "upsert-flag",
    entityType: "feature-flag",
    entityId: doc._id,
    meta: { key: doc.key, enabled: doc.enabled, rolloutPercent: doc.rolloutPercent },
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.status(201).json({ flag: doc });
});

export const listFeatureFlags = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const flags = await FeatureFlagModel.find().sort({ key: 1 }).lean().exec();
  res.json({ flags });
});
