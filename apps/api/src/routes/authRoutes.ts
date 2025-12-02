import type { Router } from "express";
import {
  createToken,
  registerUser,
  loginWithPassword,
  completePlanSelection,
  requestOtpLogin,
  verifyOtpLogin
} from "../controllers/authController";
import { checkout, portal } from "../controllers/subscriptionController";
import { requireAuth } from "../middleware/requireAuth";
import { planGate } from "../middleware/planGate";

export const registerAuthRoutes = (router: Router): void => {
  router.post("/auth/token", createToken);
  router.post("/auth/register", registerUser);
  router.post("/auth/login", loginWithPassword);
  router.post("/auth/login-otp/request", requestOtpLogin);
  router.post("/auth/login-otp/verify", verifyOtpLogin);
  router.post("/auth/complete-plan", requireAuth, completePlanSelection);

  router.post("/subscriptions/checkout", requireAuth, checkout);
  router.get("/subscriptions/portal", requireAuth, planGate("starter"), portal);
};
