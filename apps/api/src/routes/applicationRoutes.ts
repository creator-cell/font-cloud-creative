import type { Router } from "express";
import { listModels } from "../controllers/modelsController";
import { createProject, listBrandVoices, listProjects } from "../controllers/projectController";
import { buildBrandVoice } from "../controllers/brandVoiceController";
import { generate } from "../controllers/generationController";
import { getMyUsage } from "../controllers/usageController";
import { requireAuth } from "../middleware/requireAuth";
import { usageLimiter } from "../middleware/usageLimiter";

export const registerApplicationRoutes = (router: Router): void => {
  router.get("/models", requireAuth, listModels);

  router.get("/projects", requireAuth, listProjects);
  router.post("/projects", requireAuth, createProject);

  router.get("/brand-voice", requireAuth, listBrandVoices);
  router.post("/brand-voice/build", requireAuth, buildBrandVoice);

  router.post("/generate", requireAuth, usageLimiter, generate);
  router.get("/usage/me", requireAuth, getMyUsage);
};
