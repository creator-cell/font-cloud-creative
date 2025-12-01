import type { Router } from "express";
import { health } from "../controllers/healthController.js";
import { listPublicPlans } from "../controllers/publicPlansController.js";

export const registerPublicRoutes = (router: Router): void => {
  router.get("/health", health);
  router.get("/plans/public", listPublicPlans);
};
