import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const errorHandler = (
  err: Error & { status?: number; details?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.status ?? 500;
  if (env.nodeEnv !== "test") {
    console.error(err);
  }
  res.status(status).json({ error: err.message, details: err.details });
};
