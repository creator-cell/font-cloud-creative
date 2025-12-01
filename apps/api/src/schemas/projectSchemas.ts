import { z } from "zod";
import { providerIdSchema } from "./generationSchemas.js";

export const createProjectSchema = z.object({
  name: z.string().min(2),
  modelOverride: z
    .object({
      provider: providerIdSchema,
      model: z.string()
    })
    .optional()
});
