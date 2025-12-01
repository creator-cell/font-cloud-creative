import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";
import { buildBrandVoiceSchema } from "../schemas/brandVoiceSchemas.js";
import { buildStyleCard, createBrandVoice } from "../services/brandVoiceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const buildBrandVoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = buildBrandVoiceSchema.parse(req.body);
  const styleCard = buildStyleCard({ samples: payload.samples, language: payload.language });
  const brandVoice = await createBrandVoice(req.user.sub, payload.projectId, styleCard);
  res.json({ brandVoice: { id: brandVoice._id, styleCard: brandVoice.styleCard } });
});
