import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { listProviderModels } from "../../controllers/admin";

const router = Router();

router.get("/providers", requireRole("owner", "admin", "analyst"), listProviderModels);

export default router;
