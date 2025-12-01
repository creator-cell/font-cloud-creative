// @ts-nocheck
import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import {
  getOverview,
  getAnalyticsSummary,
  getAnalyticsTimeseries,
  getAnalyticsTopUsers,
  getAnalyticsTopModels,
  getAnalyticsDistribution,
  getAnalyticsCohort,
  exportAnalyticsCsv
} from "../../controllers/admin/index.js";
import { adminExportRateLimit } from "../../middleware/adminExportRateLimit.js";

const router = Router();

router.get(
  "/overview",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getOverview
);

const analyticsRoles = ["owner", "admin", "analyst"] as const;

router.get("/summary", requireRole(...analyticsRoles), getAnalyticsSummary);
router.get("/timeseries", requireRole(...analyticsRoles), getAnalyticsTimeseries);
router.get("/top/users", requireRole(...analyticsRoles), getAnalyticsTopUsers);
router.get("/top/models", requireRole(...analyticsRoles), getAnalyticsTopModels);
router.get("/distribution", requireRole(...analyticsRoles), getAnalyticsDistribution);
router.get("/cohort", requireRole(...analyticsRoles), getAnalyticsCohort);
router.get(
  "/export.csv",
  requireRole(...analyticsRoles),
  adminExportRateLimit,
  exportAnalyticsCsv
);

export default router;
