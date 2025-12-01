import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { acknowledgeAdminSystemAlert, listAdminSystemAlerts } from "../../controllers/admin/index.js";

const router = Router();

router.get("/", requireRole("owner", "admin"), listAdminSystemAlerts);

router.post(
  "/ack/:id",
  requireRole("owner", "admin"),
  adminRateLimit,
  acknowledgeAdminSystemAlert
);

export default router;
