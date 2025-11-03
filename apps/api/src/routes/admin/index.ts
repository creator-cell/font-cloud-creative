import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { impersonateUser } from "../../middleware/impersonateUser";
import analyticsRoutes from "./analyticsRoutes";
import usageRoutes from "./usageRoutes";
import revenueRoutes from "./revenueRoutes";
import modelsRoutes from "./modelsRoutes";
import featureFlagRoutes from "./featureFlagRoutes";
import auditRoutes from "./auditRoutes";
import announcementRoutes from "./announcementRoutes";
import planRoutes from "./planRoutes";
import userRoutes from "./userRoutes";
import supportRoutes from "./supportRoutes";
import pricingRoutes from "./pricingRoutes";
import financeRoutes from "./financeRoutes";
import exportRoutes from "./exportRoutes";
import alertRoutes from "./alertRoutes";

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
