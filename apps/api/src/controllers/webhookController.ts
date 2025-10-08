import type { Request, Response } from "express";
import { handleStripeWebhook } from "../services/subscriptionService";
import { asyncHandler } from "../utils/asyncHandler";

export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  await handleStripeWebhook(signature, req.body as Buffer);
  res.json({ received: true });
});
