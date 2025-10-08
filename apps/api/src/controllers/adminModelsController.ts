import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { MODELS } from "../providers/registry";
import { asyncHandler } from "../utils/asyncHandler";

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
