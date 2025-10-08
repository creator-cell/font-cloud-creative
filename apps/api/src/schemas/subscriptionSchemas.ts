import { z } from "zod";

export const checkoutSessionSchema = z.object({
  plan: z.enum(["starter", "pro", "team"])
});
