import type { Request } from "express";
import type { PlanTier } from "../constants/plans.js";
import type { ProviderId } from "../providers/types.js";

export type Role = "owner" | "admin" | "analyst" | "support" | "billing" | "user";

export interface AuthClaims {
  sub: string;
  email: string;
  plan: PlanTier;
  preferredProvider?: ProviderId;
  preferredModel?: string;
  roles: Role[];
}

declare module "express-serve-static-core" {
  interface Request {
    user: AuthClaims;
    impersonatorId?: string;
  }
}

export type AuthenticatedRequest = Request;
