import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { listModelsForPlan } from "../services/modelService";
import { asyncHandler } from "../utils/asyncHandler";

export const listModels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const models = listModelsForPlan(req.user.plan);
  res.json({ models });
});
