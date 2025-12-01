import type { Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthClaims } from "../types/express.js";

export const requireAuth: RequestHandler = (req, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthClaims;
    if (!decoded.roles || decoded.roles.length === 0) {
      decoded.roles = ["user"];
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
