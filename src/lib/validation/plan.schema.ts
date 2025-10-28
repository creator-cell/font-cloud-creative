import { z } from "zod";

const keyRegex = /^[a-z0-9-]{3,32}$/;

const billingSchema = z
  .object({
    type: z.enum(["prepaid", "subscription"]),
    period: z.enum(["monthly", "yearly", "lifetime"]).optional(),
    priceCents: z.number().int().nonnegative(),
    currency: z.enum(["INR", "USD", "SAR"]).default("INR"),
    trialDays: z.number().int().nonnegative().optional().default(0),
    taxInclusive: z.boolean().optional().default(true)
  })
  .superRefine((data, ctx) => {
    if (data.type === "subscription" && !data.period) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "billing.period is required for subscription plans",
        path: ["period"]
      });
    }
  });

const tokensSchema = z.object({
  included: z.number().int().nonnegative(),
  overagePricePer1K: z.number().int().nonnegative(),
  dailyCap: z.number().int().nonnegative().optional().default(0),
  perMessageCap: z.number().int().nonnegative().optional().default(0)
});

const limitsSchema = z
  .object({
    maxConcurrentJobs: z.number().int().nonnegative().optional(),
    contextWindowCap: z.number().int().nonnegative().optional(),
    fileUploadSizeMB: z.number().int().nonnegative().optional(),
    maxFilesPerJob: z.number().int().nonnegative().optional()
  })
  .optional();

const providersSchema = z.object({
  allowed: z.array(z.string().min(1)).min(1, "At least one provider must be allowed"),
  modelAllowlist: z.array(z.string()).optional().default([]),
  perModelMarkupPct: z.record(z.number().nonnegative()).optional().default({})
});

const visibilitySchema = z.object({
  public: z.boolean().default(true),
  sortOrder: z.number().int().nonnegative().default(100)
});

export const planSchema = z
  .object({
    key: z.string().regex(keyRegex, "Invalid plan key"),
    name: z.string().min(2).max(64),
    description: z.string().max(512).optional(),
    billing: billingSchema,
    tokens: tokensSchema,
    limits: limitsSchema,
    providers: providersSchema,
    features: z.array(z.string()).optional().default(["api_access", "file_analysis"]),
    visibility: visibilitySchema.default({ public: true, sortOrder: 100 }),
    status: z.enum(["draft", "active", "archived"]).default("active"),
    effectiveFrom: z.coerce.date().optional(),
    effectiveTo: z.coerce.date().optional()
  })
  .superRefine((data, ctx) => {
    const { effectiveFrom, effectiveTo } = data;
    if (effectiveFrom && effectiveTo && effectiveTo <= effectiveFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "effectiveTo must be greater than effectiveFrom",
        path: ["effectiveTo"]
      });
    }
  });

export type PlanInput = z.infer<typeof planSchema>;
