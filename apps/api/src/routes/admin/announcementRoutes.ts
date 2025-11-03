import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { createAnnouncement, listAnnouncements } from "../../controllers/admin";

const router = Router();

router.get(
  "/announcements",
  requireRole("owner", "admin", "support"),
  listAnnouncements
);

router.post(
  "/announcement",
  requireRole("owner", "admin"),
  adminRateLimit,
  createAnnouncement
);

export default router;
