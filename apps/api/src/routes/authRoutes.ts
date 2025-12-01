import type { Router } from "express";
import {
  createToken,
  registerUser,
  loginWithPassword,
  completePlanSelection
} from "../controllers/authController.js";
import { checkout, portal } from "../controllers/subscriptionController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { planGate } from "../middleware/planGate.js";

export const registerAuthRoutes = (router: Router): void => {
  router.post("/auth/token", createToken);
  router.post("/auth/register", registerUser);
  router.post("/auth/login", loginWithPassword);
  router.post("/auth/complete-plan", requireAuth, completePlanSelection);

  router.post("/subscriptions/checkout", requireAuth, checkout);
  router.get("/subscriptions/portal", requireAuth, planGate("starter"), portal);
};
