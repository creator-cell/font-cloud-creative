import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { listProviderModels } from "../../controllers/admin/index.js";

const router = Router();

router.get("/providers", requireRole("owner", "admin", "analyst"), listProviderModels);

export default router;
