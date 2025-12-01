import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { listSupportTickets, replyToTicket } from "../../controllers/admin/index.js";

const router = Router();

router.get("/tickets", requireRole("owner", "admin", "support"), listSupportTickets);

router.post(
  "/tickets/:id/reply",
  requireRole("owner", "admin", "support"),
  adminRateLimit,
  replyToTicket
);

export default router;
