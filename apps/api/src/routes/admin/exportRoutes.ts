import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminExportRateLimit } from "../../middleware/adminExportRateLimit.js";
import { exportAdminLedgerCsv, exportAdminUsageCsv } from "../../controllers/admin/index.js";

const router = Router();

router.get(
  "/ledger.csv",
  requireRole("owner", "admin"),
  adminExportRateLimit,
  exportAdminLedgerCsv
);

router.get(
  "/usage.csv",
  requireRole("owner", "admin"),
  adminExportRateLimit,
  exportAdminUsageCsv
);

export default router;
