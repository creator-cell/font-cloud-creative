import { z } from "zod";

export const planKeySchema = z.enum(["free", "starter", "pro", "team"]);

export const setPlanSchema = z.object({
  plan: planKeySchema,
  seats: z.number().int().positive().max(1000).optional()
});

export const grantTokensSchema = z.object({
  extraTokens: z.number().int().positive(),
  monthKey: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional()
    .default(() => {
      const now = new Date();
      return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    }),
  reason: z.string().min(5)
});

export const featureFlagUpsertSchema = z.object({
  key: z.string().min(2),
  description: z.string().optional(),
  enabled: z.boolean(),
  rolloutPercent: z.number().min(0).max(100),
  audienceQuery: z.record(z.any()).optional()
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  audience: z.enum(["all", "paid", "free"]),
  link: z.string().url().optional(),
  publishAt: z.string().datetime().optional(),
  published: z.boolean().optional()
});

export const auditQuerySchema = z.object({
  actorId: z.string().optional(),
  action: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(500).optional()
});

export const topUsersQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(200).optional()
});

export const supportReplySchema = z.object({
  message: z.string().min(2),
  status: z.enum(["open", "pending", "resolved", "closed"]).optional(),
  assigneeId: z.string().optional()
});

export const planUpsertSchema = z.object({
  key: planKeySchema,
  name: z.string().min(3),
  monthlyPriceINR: z.number().nonnegative(),
  monthlyTokens: z.number().int().positive(),
  features: z.array(z.string()).default([]),
  premiumModelAccess: z.array(z.string()).default([]),
  overagePer1K: z.number().nonnegative().default(0),
  stripePriceId: z.string().optional()
});
