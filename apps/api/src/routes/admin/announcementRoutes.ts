import { Router } from "express";
import { requireRole } from "../../middleware/requireRole.js";
import { adminRateLimit } from "../../middleware/adminRateLimit.js";
import { createAnnouncement, listAnnouncements } from "../../controllers/admin/index.js";

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
