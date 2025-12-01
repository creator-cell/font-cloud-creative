import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { impersonateUser } from "../middleware/impersonateUser.js";
import { requireRole } from "../middleware/requireRole.js";
import { adminRateLimit } from "../middleware/adminRateLimit.js";
import { adminExportRateLimit } from "../middleware/adminExportRateLimit.js";
import {
  getOverview,
  getTopUsers,
  getMRR,
  setUserPlan,
  grantTokens,
  listProviderModels,
  upsertFeatureFlag,
  listFeatureFlags,
  getAuditLog,
  createAnnouncement,
  listAnnouncements,
  throttleFreeTier,
  listSupportTickets,
  replyToTicket,
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listAdminWallets,
  listAdminLedger,
  listAdminUsage,
  adjustAdminWallet,
  exportAdminLedgerCsv,
  exportAdminUsageCsv,
  listProviderPricing,
  createProviderPricing,
  updateProviderPricing,
  retireProviderPricing,
  acknowledgeAdminSystemAlert,
  listAdminSystemAlerts
} from "../controllers/admin/index.js";

const adminRouter = Router();

adminRouter.use(requireAuth, impersonateUser);

adminRouter.get(
  "/analytics/overview",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getOverview
);
adminRouter.get(
  "/usage/top-users",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getTopUsers
);
adminRouter.get(
  "/revenue/mrr",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
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
adminRouter.get(
  "/plans/:id",
  requireRole("owner", "admin", "billing"),
  getPlan
);
adminRouter.post(
  "/plans",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  createPlan
);
adminRouter.patch(
  "/plans/:id",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  updatePlan
);
adminRouter.delete(
  "/plans/:id",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  deletePlan
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

adminRouter.get("/pricing", requireRole("owner", "admin"), listProviderPricing);
adminRouter.post(
  "/pricing",
  requireRole("owner", "admin"),
  adminRateLimit,
  createProviderPricing
);
adminRouter.patch(
  "/pricing/:id",
  requireRole("owner", "admin"),
  adminRateLimit,
  updateProviderPricing
);
adminRouter.post(
  "/pricing/:id/retire",
  requireRole("owner", "admin"),
  adminRateLimit,
  retireProviderPricing
);

adminRouter.get("/wallets", requireRole("owner", "admin"), listAdminWallets);
adminRouter.get("/ledger", requireRole("owner", "admin"), listAdminLedger);
adminRouter.get("/usage", requireRole("owner", "admin"), listAdminUsage);
adminRouter.post(
  "/wallets/adjust",
  requireRole("owner", "admin"),
  adminRateLimit,
  adjustAdminWallet
);
adminRouter.get(
  "/export/ledger.csv",
  requireRole("owner", "admin"),
  adminExportRateLimit,
  exportAdminLedgerCsv
);
adminRouter.get(
  "/export/usage.csv",
  requireRole("owner", "admin"),
  adminExportRateLimit,
  exportAdminUsageCsv
);
adminRouter.get("/alerts", requireRole("owner", "admin"), listAdminSystemAlerts);
adminRouter.post(
  "/alerts/ack/:id",
  requireRole("owner", "admin"),
  adminRateLimit,
  acknowledgeAdminSystemAlert
);

export default adminRouter;
