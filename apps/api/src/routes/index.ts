import { Router } from "express";
import { createToken } from "../controllers/authController";
import { listModels } from "../controllers/modelsController";
import { buildBrandVoice } from "../controllers/brandVoiceController";
import { generate } from "../controllers/generationController";
import { getMyUsage } from "../controllers/usageController";
import { checkout, portal } from "../controllers/subscriptionController";
import { health } from "../controllers/healthController";
import { requireAuth } from "../middleware/requireAuth";
import { planGate } from "../middleware/planGate";
import { usageLimiter } from "../middleware/usageLimiter";
import { createProject, listBrandVoices, listProjects } from "../controllers/projectController";
import { requireRole } from "../middleware/requireRole";
import { impersonateUser } from "../middleware/impersonateUser";
import { adminRateLimit } from "../middleware/adminRateLimit";
import {
  getOverview,
  getTopUsers,
  getMRR
} from "../controllers/adminAnalyticsController";
import { setUserPlan, grantTokens } from "../controllers/adminUsersController";
import { listProviderModels } from "../controllers/adminModelsController";
import { upsertFeatureFlag, listFeatureFlags } from "../controllers/adminFlagsController";
import { getAuditLog } from "../controllers/adminAuditController";
import { createAnnouncement, listAnnouncements } from "../controllers/adminAnnouncementController";
import { throttleFreeTier } from "../controllers/adminUsageController";
import { listSupportTickets, replyToTicket } from "../controllers/adminSupportController";
import { listPlans, upsertPlan } from "../controllers/adminPlansController";

const router = Router();

router.get("/health", health);
router.post("/auth/token", createToken);

router.get("/models", requireAuth, listModels);
router.get("/projects", requireAuth, listProjects);
router.post("/projects", requireAuth, createProject);
router.get("/brand-voice", requireAuth, listBrandVoices);
router.post("/brand-voice/build", requireAuth, buildBrandVoice);
router.post("/generate", requireAuth, usageLimiter, generate);
router.get("/usage/me", requireAuth, getMyUsage);
router.post("/subscriptions/checkout", requireAuth, checkout);
router.get("/subscriptions/portal", requireAuth, planGate("starter"), portal);

const adminRouter = Router();
adminRouter.use(requireAuth, impersonateUser);

adminRouter.get(
  "/analytics/overview",
  requireRole("owner", "admin", "analyst"),
  getOverview
);
adminRouter.get(
  "/usage/top-users",
  requireRole("owner", "admin", "analyst"),
  getTopUsers
);
adminRouter.get(
  "/revenue/mrr",
  requireRole("owner", "admin", "analyst", "billing"),
  getMRR
);
adminRouter.get(
  "/models/providers",
  requireRole("owner", "admin", "analyst"),
  listProviderModels
);

adminRouter.get("/flags", requireRole("owner", "admin", "support"), listFeatureFlags);
adminRouter.post(
  "/flags",
  requireRole("owner", "admin"),
  adminRateLimit,
  upsertFeatureFlag
);

adminRouter.get(
  "/audit",
  requireRole("owner", "admin", "analyst"),
  getAuditLog
);

adminRouter.get(
  "/announcements",
  requireRole("owner", "admin", "support"),
  listAnnouncements
);
adminRouter.post(
  "/announcement",
  requireRole("owner", "admin"),
  adminRateLimit,
  createAnnouncement
);

adminRouter.get(
  "/plans",
  requireRole("owner", "admin", "billing"),
  listPlans
);
adminRouter.post(
  "/plans",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  upsertPlan
);

adminRouter.post(
  "/users/:id/set-plan",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  setUserPlan
);
adminRouter.post(
  "/users/:id/grant-tokens",
  requireRole("owner", "admin", "support"),
  adminRateLimit,
  grantTokens
);

adminRouter.post(
  "/usage/throttle",
  requireRole("owner", "admin"),
  adminRateLimit,
  throttleFreeTier
);

adminRouter.get(
  "/support/tickets",
  requireRole("owner", "admin", "support"),
  listSupportTickets
);
adminRouter.post(
  "/support/tickets/:id/reply",
  requireRole("owner", "admin", "support"),
  adminRateLimit,
  replyToTicket
);

router.use("/admin", adminRouter);

export default router;
