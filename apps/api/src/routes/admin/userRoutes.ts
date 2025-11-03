import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { grantTokens, setUserPlan } from "../../controllers/admin";

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
