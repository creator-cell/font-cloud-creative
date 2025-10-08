import type { Request, Response } from "express";
import { createTokenSchema } from "../schemas/authSchemas";
import { issueUserToken } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";

export const createToken = asyncHandler(async (req: Request, res: Response) => {
  const payload = createTokenSchema.parse(req.body);
  const result = await issueUserToken(payload);
  res.json({ token: result.token, user: result.claims });
});
