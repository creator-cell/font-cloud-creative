import type { Request, Response } from "express";
import { handleStripeWebhook } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  await handleStripeWebhook(signature, req.body as Buffer);
  res.json({ received: true });
});
