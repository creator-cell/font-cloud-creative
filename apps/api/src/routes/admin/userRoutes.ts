import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { grantTokens, setUserPlan } from "../../controllers/admin/index.js";

const router = Router();

router.post(
  "/:id/set-plan",
  requireRole("owner", "admin", "billing"),
  adminRateLimit,
  setUserPlan
);

router.post(
  "/:id/grant-tokens",
  requireRole("owner", "admin", "support"),
  adminRateLimit,
  grantTokens
);

export default router;
