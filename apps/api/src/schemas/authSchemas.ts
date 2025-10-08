import { z } from "zod";
import { providerIdSchema } from "./generationSchemas";

export const createTokenSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  plan: z.enum(["free", "starter", "pro", "team"]),
  preferredProvider: providerIdSchema.optional(),
  preferredModel: z.string().optional()
});
