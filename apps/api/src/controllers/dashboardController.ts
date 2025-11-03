import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { asyncHandler } from "../utils/asyncHandler";
import { getDashboardSummary } from "../services/dashboardService";

export const getUserDashboardSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const summary = await getDashboardSummary(req.user.sub, req.user.plan);
  res.json(summary);
});

