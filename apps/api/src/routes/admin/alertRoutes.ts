import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { acknowledgeAdminSystemAlert, listAdminSystemAlerts } from "../../controllers/admin";

const router = Router();

router.get("/", requireRole("owner", "admin"), listAdminSystemAlerts);

router.post(
  "/ack/:id",
  requireRole("owner", "admin"),
  adminRateLimit,
  acknowledgeAdminSystemAlert
);

export default router;
