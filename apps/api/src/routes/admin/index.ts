import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { impersonateUser } from "../../middleware/impersonateUser.js";
import analyticsRoutes from "./analyticsRoutes.js";
import usageRoutes from "./usageRoutes.js";
import revenueRoutes from "./revenueRoutes.js";
import modelsRoutes from "./modelsRoutes.js";
import featureFlagRoutes from "./featureFlagRoutes.js";
import auditRoutes from "./auditRoutes.js";
import announcementRoutes from "./announcementRoutes.js";
import planRoutes from "./planRoutes.js";
import userRoutes from "./userRoutes.js";
import supportRoutes from "./supportRoutes.js";
import pricingRoutes from "./pricingRoutes.js";
import financeRoutes from "./financeRoutes.js";
import exportRoutes from "./exportRoutes.js";
import alertRoutes from "./alertRoutes.js";

const adminRouter = Router();

adminRouter.use(requireAuth, impersonateUser);

adminRouter.use("/analytics", analyticsRoutes);
adminRouter.use("/usage", usageRoutes);
adminRouter.use("/revenue", revenueRoutes);
adminRouter.use("/models", modelsRoutes);
adminRouter.use("/flags", featureFlagRoutes);
adminRouter.use("/audit", auditRoutes);
adminRouter.use(announcementRoutes);
adminRouter.use("/plans", planRoutes);
adminRouter.use("/users", userRoutes);
adminRouter.use("/support", supportRoutes);
adminRouter.use("/pricing", pricingRoutes);
adminRouter.use(financeRoutes);
adminRouter.use("/export", exportRoutes);
adminRouter.use("/alerts", alertRoutes);

export default adminRouter;
