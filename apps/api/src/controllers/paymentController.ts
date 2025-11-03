import type { Request, Response } from "express";
import { amazonPlanChargeSchema } from "../schemas/paymentSchemas";
import { asyncHandler } from "../utils/asyncHandler";
import { chargePlanWithAmazon } from "../services/payments/planPayments";

export const createAmazonPlanCharge = asyncHandler(async (req: Request, res: Response) => {
  const payload = amazonPlanChargeSchema.parse(req.body);

  try {
    const payment = await chargePlanWithAmazon(payload.plan, payload.email);
    res.json({ payment });
  } catch (error) {
    console.error("[payments] amazon plan charge failed", error);
    res.status((error as Error & { status?: number }).status ?? 502).json({
      error: "Failed to process Amazon Pay charge.",
      details: (error as Error & { details?: unknown }).details
    });
  }
});

