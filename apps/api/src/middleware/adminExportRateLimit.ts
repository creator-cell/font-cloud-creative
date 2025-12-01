import type { Response, NextFunction } from "express";
import { redis } from "../config/redis.js";
import type { AuthenticatedRequest } from "../types/express.js";

const WINDOW_SECONDS = 60;
const MAX_EXPORTS = 30;

export const adminExportRateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const key = `admin:export:${req.user.sub}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  if (count > MAX_EXPORTS) {
    res.status(429).json({ error: "Export rate limit exceeded" });
    return;
  }

  next();
};
