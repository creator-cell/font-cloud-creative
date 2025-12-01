import type { Response, NextFunction } from "express";
import { redis } from "../config/redis.js";
import type { AuthenticatedRequest } from "../types/express.js";

const WINDOW_SECONDS = 30;
const MAX_ACTIONS = 20;

export const adminRateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const key = `admin:rate:${req.user.sub}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  if (count > MAX_ACTIONS) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }

  next();
};
