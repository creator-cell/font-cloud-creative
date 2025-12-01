import type { Router } from "express";
import { createAmazonPlanCharge } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const registerPaymentRoutes = (router: Router): void => {
  router.post("/payments/amazon/plan", requireAuth, createAmazonPlanCharge);
};

