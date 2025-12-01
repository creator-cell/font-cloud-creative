import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardSummary } from "../services/dashboardService.js";

export const getUserDashboardSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const summary = await getDashboardSummary(req.user.sub, req.user.plan);
  res.json(summary);
});

