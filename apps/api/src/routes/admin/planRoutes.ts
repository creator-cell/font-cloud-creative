import { Router } from "express";
import { requireRole } from "../../middleware/requireRole";
import { adminRateLimit } from "../../middleware/adminRateLimit";
import { createPlan, deletePlan, getPlan, listPlans, updatePlan } from "../../controllers/admin";

const router = Router();

const billingRoles = ["owner", "admin", "billing"] as const;

router.get("/", requireRole(...billingRoles), listPlans);
router.get("/:id", requireRole(...billingRoles), getPlan);

router.post("/", requireRole(...billingRoles), adminRateLimit, createPlan);
router.patch("/:id", requireRole(...billingRoles), adminRateLimit, updatePlan);
router.delete("/:id", requireRole(...billingRoles), adminRateLimit, deletePlan);

export default router;
