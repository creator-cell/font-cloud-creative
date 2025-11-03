import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { listFeatureFlags, upsertFeatureFlag } from "../../controllers/admin";

const router = Router();

router.get("/", requireRole("owner", "admin", "support"), listFeatureFlags);

router.post("/", requireRole("owner", "admin"), adminRateLimit, upsertFeatureFlag);

export default router;
