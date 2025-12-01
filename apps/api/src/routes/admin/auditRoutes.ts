import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { getAuditLog } from "../../controllers/admin/index.js";

const router = Router();

router.get("/", requireRole("owner", "admin", "analyst"), getAuditLog);

export default router;
