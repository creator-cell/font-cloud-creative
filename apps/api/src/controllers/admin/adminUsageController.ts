import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/express.js";
import { redis } from "../../config/redis.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auditService } from "../../services/auditService.js";

const THROTTLE_KEY = "feature:throttle-free-tier";

export const throttleFreeTier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await redis.set(THROTTLE_KEY, "1", "EX", 60 * 60 * 12);

  await auditService.record({
    actorId: req.impersonatorId ?? req.user.sub,
    action: "throttle-free-tier",
    entityType: "usage-policy",
    meta: {},
    ip: req.ip,
    userAgent: req.get("user-agent") ?? ""
  });

  res.json({ status: "ok" });
});
