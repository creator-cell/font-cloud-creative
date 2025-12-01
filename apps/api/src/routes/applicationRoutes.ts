import type { Router } from "express";
import { listModels } from "../controllers/modelsController.js";
import { createProject, listBrandVoices, listProjects } from "../controllers/projectController.js";
import { buildBrandVoice } from "../controllers/brandVoiceController.js";
import { generate } from "../controllers/generationController.js";
import { getMyUsage } from "../controllers/usageController.js";
import { listWalletTransactions, rechargeWallet } from "../controllers/walletController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { usageLimiter } from "../middleware/usageLimiter.js";

export const registerApplicationRoutes = (router: Router): void => {
  router.get("/models", requireAuth, listModels);

  router.get("/projects", requireAuth, listProjects);
  router.post("/projects", requireAuth, createProject);

  router.get("/brand-voice", requireAuth, listBrandVoices);
  router.post("/brand-voice/build", requireAuth, buildBrandVoice);

  router.post("/generate", requireAuth, usageLimiter, generate);
  router.get("/usage/me", requireAuth, getMyUsage);
  router.get("/wallet/transactions", requireAuth, listWalletTransactions);
  router.post("/wallet/recharge", requireAuth, rechargeWallet);
};
