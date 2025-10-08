import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { getUsageSummary } from "../services/usageService";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const summary = await getUsageSummary(req.user.sub, req.user.plan);
  res.json(summary);
});
