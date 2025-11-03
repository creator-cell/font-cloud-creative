import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { listSupportTickets, replyToTicket } from "../../controllers/admin";

const router = Router();

router.get("/tickets", requireRole("owner", "admin", "support"), listSupportTickets);

router.post(
  "/tickets/:id/reply",
  requireRole("owner", "admin", "support"),
  adminRateLimit,
  replyToTicket
);

export default router;
