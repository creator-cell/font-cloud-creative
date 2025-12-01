import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/express.js";
import { MODELS } from "../../providers/registry.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const listProviderModels = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const grouped = MODELS.reduce<Record<string, typeof MODELS>>((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {});

  res.json({ providers: grouped });
});
