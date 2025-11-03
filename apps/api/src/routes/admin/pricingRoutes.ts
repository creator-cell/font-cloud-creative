import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import {
  createProviderPricing,
  listProviderPricing,
  retireProviderPricing,
  updateProviderPricing
} from "../../controllers/admin";

const router = Router();

router.get("/", requireRole("owner", "admin"), listProviderPricing);

router.post("/", requireRole("owner", "admin"), adminRateLimit, createProviderPricing);

router.patch(
  "/:id",
  requireRole("owner", "admin"),
  adminRateLimit,
  updateProviderPricing
);

router.post(
  "/:id/retire",
  requireRole("owner", "admin"),
  adminRateLimit,
  retireProviderPricing
);

export default router;
