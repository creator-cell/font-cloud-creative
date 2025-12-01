import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { getUsageSummary } from "../services/usageService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const summary = await getUsageSummary(req.user.sub, req.user.plan);
  res.json(summary);
});
