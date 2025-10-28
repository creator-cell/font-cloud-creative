import { z } from "zod";

export const pricingCurrencySchema = z.enum(["USD", "INR", "SAR"]);

export const listPricingQuerySchema = z.object({
  provider: z.string().trim().optional(),
  model: z.string().trim().optional(),
  currency: pricingCurrencySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum(["effectiveFrom"]).default("effectiveFrom"),
  direction: z.enum(["asc", "desc"]).default("desc")
});

const priceBodyBase = z.object({
  provider: z.enum(["openai", "anthropic", "google", "ollama", "allam"]),
  model: z.string().min(1),
  currency: pricingCurrencySchema,
  inputPer1kCents: z.number().min(0),
  outputPer1kCents: z.number().min(0),
  effectiveFrom: z.coerce.date().optional(),
  effectiveTo: z
    .preprocess((value) => (value === "" || value === undefined ? undefined : value), z.coerce.date().optional()),
  notes: z.string().trim().max(500).optional()
});

export const createPricingSchema = priceBodyBase.extend({
  effectiveFrom: z.coerce.date().optional()
});

export const updatePricingSchema = z
  .object({
    inputPer1kCents: z.number().min(0).optional(),
    outputPer1kCents: z.number().min(0).optional(),
    effectiveFrom: z.coerce.date().optional(),
    effectiveTo: z
      .preprocess((value) => (value === "" || value === undefined ? undefined : value), z.coerce.date().optional()),
    notes: z.string().trim().max(500).optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided."
  });
