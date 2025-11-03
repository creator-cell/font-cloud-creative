import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { getAuditLog } from "../../controllers/admin";

const router = Router();

router.get("/", requireRole("owner", "admin", "analyst"), getAuditLog);

export default router;
