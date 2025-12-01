import { z } from "zod";
import { pricingCurrencySchema } from "./adminPricingSchemas.js";

const sortDirection = z.enum(["asc", "desc"]).default("desc");

export const listWalletsQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["tokenBalance", "holdAmount", "updatedAt"]).default("updatedAt"),
  direction: sortDirection
});

const dateString = z
  .string()
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), { message: "Invalid date" });

export const ledgerQuerySchema = z.object({
  userId: z.string().trim().optional(),
  type: z.enum(["grant", "spend", "hold", "hold_release", "refund", "adjustment"]).optional(),
  source: z.string().trim().optional(),
  provider: z.string().trim().optional(),
  model: z.string().trim().optional(),
  refId: z.string().trim().optional(),
  from: dateString.optional(),
  to: dateString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  sort: z.enum(["createdAt"]).default("createdAt"),
  direction: sortDirection
});

export const usageQuerySchema = z.object({
  userId: z.string().trim().optional(),
  provider: z.string().trim().optional(),
  model: z.string().trim().optional(),
  status: z.enum(["completed", "failed"]).optional(),
  from: dateString.optional(),
  to: dateString.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  sort: z.enum(["createdAt", "totalTokens"]).default("createdAt"),
  direction: sortDirection,
  displayCurrency: pricingCurrencySchema.optional()
});

export const adjustWalletSchema = z.object({
  userId: z.string().min(1),
  amountTokens: z
    .coerce.number()
    .min(-1_000_000)
    .max(1_000_000)
    .refine((value) => value !== 0, { message: "Amount cannot be zero" }),
  reason: z.string().min(3).max(200)
});
