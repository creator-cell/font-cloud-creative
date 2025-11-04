import type { Request, Response } from "express";
import {
  createTokenSchema,
  registerUserSchema,
  passwordLoginSchema,
  planSelectionSchema
} from "../schemas/authSchemas";
import { issueUserToken } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { UserModel, PurchaseModel } from "../models";
import { hashPassword, verifyPassword } from "../utils/password";
import type { AuthenticatedRequest } from "../types/express";
import { allocateOnRegistration, type PlanSnapshot } from "../services/token/allocateOnRegistration";
import { Types } from "mongoose";

const PLAN_REGISTRY: Record<string, PlanSnapshot> = {
  free: {
    key: "free",
    name: "Free",
    billing: { currency: "INR" },
    tokens: { included: 15000 }
  },
  starter: {
    key: "starter",
    name: "Starter",
    billing: { currency: "INR" },
    tokens: { included: 200000 }
  },
  pro: {
    key: "pro",
    name: "Pro",
    billing: { currency: "INR" },
    tokens: { included: 1200000 }
  },
  team: {
    key: "team",
    name: "Team",
    billing: { currency: "INR" },
    tokens: { included: 3000000 }
  }
};

const resolvePlanSnapshot = (planKey: string): PlanSnapshot => {
  return PLAN_REGISTRY[planKey] ?? PLAN_REGISTRY.starter;
};

export const createToken = asyncHandler(async (req: Request, res: Response) => {
  const payload = createTokenSchema.parse(req.body);
  const result = await issueUserToken(payload);
  res.json({ token: result.token, user: result.claims, created: result.created });
});

const simulatePayment = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    status: "success" as const,
    gateway: "sandbox",
    reference: `sim_${Date.now()}`
  };
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerUserSchema.parse(req.body);
  const email = payload.email.toLowerCase();

  const existing = await UserModel.findOne({ email });
  if (existing) {
    res.status(409).json({
      error: "An account already exists for this email address."
    });
    return;
  }

  const payment = await simulatePayment();
  const passwordHash = hashPassword(payload.password);
  const { token, claims, created } = await issueUserToken({
    userId: email,
    email,
    plan: payload.plan,
    passwordHash
  });

  if (payload.name) {
    await UserModel.findByIdAndUpdate(claims.sub, { name: payload.name });
  }

  const planSnapshot = resolvePlanSnapshot(payload.plan);
  const userObjectId = new Types.ObjectId(claims.sub);

  const allocation = await allocateOnRegistration(userObjectId, planSnapshot, payment.reference);
  await PurchaseModel.create({ userId: userObjectId, planSnapshot });

  res.status(201).json({
    payment,
    token,
    created,
    user: {
      id: claims.sub,
      email: claims.email,
      plan: claims.plan,
      roles: claims.roles,
      name: payload.name ?? null
    },
    wallet: {
      credited: allocation.credited,
      balance: allocation.balance
    }
  });
});

export const loginWithPassword = asyncHandler(async (req: Request, res: Response) => {
  const payload = passwordLoginSchema.parse(req.body);
  const email = payload.email.toLowerCase();
  const user = await UserModel.findOne({ email });

  if (!user || !user.passwordHash || !verifyPassword(payload.password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const { token, claims } = await issueUserToken({
    userId: user._id.toHexString(),
    email: user.email,
    plan: user.plan,
    preferredProvider: user.preferredProvider,
    preferredModel: user.preferredModel
  });

  res.json({
    token,
    user: {
      id: claims.sub,
      email: claims.email,
      plan: claims.plan,
      roles: claims.roles,
      name: user.name ?? null
    }
  });
});

export const completePlanSelection = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = planSelectionSchema.parse(req.body);

    const payment = await simulatePayment();
    await UserModel.findByIdAndUpdate(req.user.sub, { plan: payload.plan });
    const planSnapshot = resolvePlanSnapshot(payload.plan);
    const userObjectId = new Types.ObjectId(req.user.sub);
    const allocation = await allocateOnRegistration(userObjectId, planSnapshot, payment.reference, "plan-upgrade");
    await PurchaseModel.create({ userId: userObjectId, planSnapshot });
    const { token, claims } = await issueUserToken({
      userId: req.user.sub,
      email: req.user.email,
      plan: payload.plan,
      preferredProvider: req.user.preferredProvider,
      preferredModel: req.user.preferredModel
    });

    res.json({
      payment,
      token,
      user: {
        id: claims.sub,
        email: claims.email,
        plan: claims.plan,
        roles: claims.roles
      },
      wallet: {
        credited: allocation.credited,
        balance: allocation.balance
      }
    });
  }
);
