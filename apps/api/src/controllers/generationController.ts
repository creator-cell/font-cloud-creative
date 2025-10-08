import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { generateRequestSchema } from "../schemas/generationSchemas";
import { generateContent } from "../services/generationService";
import { asyncHandler } from "../utils/asyncHandler";

export const generate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = generateRequestSchema.parse(req.body);
  const result = await generateContent({
    user: req.user,
    type: payload.type,
    inputs: payload.inputs,
    projectId: payload.projectId,
    styleCardId: payload.styleCardId,
    provider: payload.provider,
    model: payload.model,
    claimsMode: payload.claimsMode
  });

  res.json(result);
});
