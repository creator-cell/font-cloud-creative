import type { Response, NextFunction } from "express";
import { comparePlans, type PlanTier } from "../constants/plans";
import type { AuthenticatedRequest } from "../types/express";

export const planGate = (minTier: PlanTier) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!comparePlans(req.user.plan, minTier)) {
      res.status(403).json({ error: "Plan upgrade required", minTier });
      return;
    }

    next();
  };
