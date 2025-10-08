import { z } from "zod";

export const buildBrandVoiceSchema = z.object({
  projectId: z.string(),
  samples: z.array(z.string()).min(3).max(10),
  language: z.string().optional()
});
