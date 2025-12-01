import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { generateRequestSchema } from "../schemas/generationSchemas.js";
import { generateContent } from "../services/generationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
