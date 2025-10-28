import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../../types/express";
import { AuditLogModel } from "../../models";
import { auditQuerySchema } from "../../schemas/adminSchemas";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAuditLog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = auditQuerySchema.parse(req.query);
  const query: Record<string, unknown> = {};

  if (params.actorId && Types.ObjectId.isValid(params.actorId)) {
    query.actorId = new Types.ObjectId(params.actorId);
  }
  if (params.action) {
    query.action = params.action;
  }
  if (params.start || params.end) {
    query.createdAt = {
      ...(params.start ? { $gte: new Date(params.start) } : {}),
      ...(params.end ? { $lte: new Date(params.end) } : {})
    };
  }

  const limit = params.limit ?? 200;
  const logs = await AuditLogModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  res.json({ logs });
});
