import type { Response, NextFunction } from "express";
import { redis } from "../config/redis.js";
import { assertWithinQuota } from "../services/usageService.js";
import type { AuthenticatedRequest } from "../types/express.js";

const RATE_LIMIT = 60; // requests per minute per user

export const usageLimiter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const rateKey = `usage:minute:${req.user.sub}`;
    const count = await redis.incr(rateKey);
    if (count === 1) {
      await redis.expire(rateKey, 60);
    }
    if (count > RATE_LIMIT) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }

    await assertWithinQuota(req.user.sub, req.user.plan);
    next();
  } catch (err) {
    const status = (err as Error & { status?: number }).status ?? 500;
    res.status(status).json({ error: (err as Error).message });
  }
};
