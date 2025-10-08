import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest, Role } from "../types/express";

export const requireRole = (...allowed: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const roles = req.user.roles ?? [];
    if (!roles.some((role) => allowed.includes(role))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
