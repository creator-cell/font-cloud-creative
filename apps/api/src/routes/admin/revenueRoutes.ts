import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { getMRR } from "../../controllers/admin";

const router = Router();

router.get(
  "/mrr",
  requireRole("owner", "admin", "analyst", "support", "billing", "user"),
  getMRR
);

export default router;
