import { z } from "zod";

export const amazonPlanChargeSchema = z.object({
  plan: z.enum(["free", "starter", "pro", "team"]),
  email: z.string().email(),
  note: z.string().max(200).optional()
});

export type AmazonPlanChargeSchema = z.infer<typeof amazonPlanChargeSchema>;

