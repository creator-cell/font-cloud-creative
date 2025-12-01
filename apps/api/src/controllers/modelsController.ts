import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { listModelsForPlan } from "../services/modelService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listModels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const models = listModelsForPlan(req.user.plan);
  res.json({ models });
});
