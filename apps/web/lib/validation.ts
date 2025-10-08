import { z } from "zod";

export const providerIdSchema = z.enum(["openai", "anthropic", "google", "ollama"]);
export const generationTypeSchema = z.enum(["ad", "carousel", "blog"]);

export const generateRequestSchema = z.object({
  type: generationTypeSchema,
  inputs: z.record(z.any()),
  projectId: z.string().optional(),
  styleCardId: z.string().optional(),
  provider: providerIdSchema.optional(),
  model: z.string().optional(),
  claimsMode: z.boolean().optional()
});

export const sampleSchema = z.array(z.string().min(10)).min(3).max(10);
