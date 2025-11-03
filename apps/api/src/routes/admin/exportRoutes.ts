import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminExportRateLimit } from "../../middleware/adminExportRateLimit";
import { exportAdminLedgerCsv, exportAdminUsageCsv } from "../../controllers/admin";

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
