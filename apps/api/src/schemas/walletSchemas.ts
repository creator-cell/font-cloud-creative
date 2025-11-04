import { z } from "zod";

export const rechargeWalletSchema = z.object({
  tokens: z.number().int().positive(),
  currency: z.enum(["USD", "INR", "SAR"]).default("INR"),
  amountCents: z.number().int().nonnegative().optional(),
  reference: z.string().min(1).optional()
});

export const walletTransactionsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  kind: z.enum(["all", "credit", "debit", "hold"]).optional(),
  type: z.string().optional(),
  source: z.string().optional()
});
