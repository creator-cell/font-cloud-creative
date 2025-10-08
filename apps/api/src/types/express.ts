import type { Request } from "express";
import type { PlanTier } from "../constants/plans";
import type { ProviderId } from "../providers/types";

export type Role = "owner" | "admin" | "analyst" | "support" | "billing" | "user";

export interface AuthClaims {
  sub: string;
  email: string;
  plan: PlanTier;
  preferredProvider?: ProviderId;
  preferredModel?: string;
  roles: Role[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthClaims;
  impersonatorId?: string;
}
