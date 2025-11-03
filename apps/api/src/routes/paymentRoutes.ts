import type { Router } from "express";
import { createAmazonPlanCharge } from "../controllers/paymentController";
import { requireAuth } from "../middleware/requireAuth";

export const registerPaymentRoutes = (router: Router): void => {
  router.post("/payments/amazon/plan", requireAuth, createAmazonPlanCharge);
};

