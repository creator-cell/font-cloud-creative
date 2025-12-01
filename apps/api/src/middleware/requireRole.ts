import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { Role } from "../types/express.js";

export const requireRole = (...allowed: Role[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): ReturnType<RequestHandler> => {
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
