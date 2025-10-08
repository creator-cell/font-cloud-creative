import type { Response, Request } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { checkoutSessionSchema } from "../schemas/subscriptionSchemas";
import { createBillingPortalSession, createCheckoutSession } from "../services/subscriptionService";
import { asyncHandler } from "../utils/asyncHandler";

const resolveOrigin = (req: Request): string => req.headers.origin?.toString() ?? "http://localhost:3000";

export const checkout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { plan } = checkoutSessionSchema.parse(req.body);
  const url = await createCheckoutSession(req.user.sub, req.user.email, plan, resolveOrigin(req));
  res.json({ url });
});

export const portal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const url = await createBillingPortalSession(req.user.sub, resolveOrigin(req));
  res.json({ url });
});
