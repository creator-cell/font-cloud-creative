import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { listFeatureFlags, upsertFeatureFlag } from "../../controllers/admin/index.js";

const router = Router();

router.get("/", requireRole("owner", "admin", "support"), listFeatureFlags);

router.post("/", requireRole("owner", "admin"), adminRateLimit, upsertFeatureFlag);

export default router;
