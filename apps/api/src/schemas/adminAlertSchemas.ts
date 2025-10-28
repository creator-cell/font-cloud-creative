import { z } from "zod";

export const listAlertsQuerySchema = z.object({
  type: z
    .enum(["spend_spike", "insufficient_tokens", "negative_balance", "cap_exceeded"])
    .optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
  from: z.preprocess(
    (value) => (value ? new Date(String(value)) : undefined),
    z.date().optional()
  ),
  to: z.preprocess(
    (value) => (value ? new Date(String(value)) : undefined),
    z.date().optional()
  ),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});
