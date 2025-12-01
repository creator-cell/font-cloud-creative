import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { getTopUsers, listAdminUsage, throttleFreeTier } from "../../controllers/admin/index.js";

const router = Router();

router.get(
  "/",
  requireRole("owner", "admin"),
  listAdminUsage
);

router.get(
  "/top-users",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getTopUsers
);

router.post(
  "/throttle",
  requireRole("owner", "admin"),
  adminRateLimit,
  throttleFreeTier
);

export default router;
