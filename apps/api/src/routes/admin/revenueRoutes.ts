import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { getMRR } from "../../controllers/admin/index.js";

const router = Router();

router.get(
  "/mrr",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getMRR
);

export default router;
