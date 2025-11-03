import type { PlanTier } from "../constants/plans";
import { PlanModel } from "../models/Plan";
import type { PlanSnapshot } from "./token/allocateOnRegistration";

type PlanRegistryEntry = PlanSnapshot & {
  billing: PlanSnapshot["billing"] & { amountPaise?: number };
};

const FALLBACK_PLAN_REGISTRY: Record<PlanTier, PlanRegistryEntry> = {
  free: {
    key: "free",
    name: "Free",
    billing: { currency: "INR", amountPaise: 0 },
    tokens: { included: 15000 }
  },
  starter: {
    key: "starter",
    name: "Starter",
    billing: { currency: "INR", amountPaise: 2400 },
    tokens: { included: 200000 }
  },
  pro: {
    key: "pro",
    name: "Pro",
    billing: { currency: "INR", amountPaise: 8200 },
    tokens: { included: 1200000 }
  },
  team: {
    key: "team",
    name: "Team",
    billing: { currency: "INR", amountPaise: 19800 },
    tokens: { included: 3000000 }
  }
};

export const resolvePlanSnapshot = (planKey: PlanTier): PlanSnapshot => {
  const plan = FALLBACK_PLAN_REGISTRY[planKey] ?? FALLBACK_PLAN_REGISTRY.starter;
  return {
    key: plan.key,
    name: plan.name,
    billing: { currency: plan.billing.currency, amountPaise: plan.billing.amountPaise },
    tokens: plan.tokens
  };
};

export const getPlanBillingInfo = async (
  planKey: PlanTier
): Promise<{
  planKey: PlanTier;
  name: string;
  amountPaise: number;
  currencyCode: "INR" | "USD" | "SAR";
}> => {
  const fallback = FALLBACK_PLAN_REGISTRY[planKey] ?? FALLBACK_PLAN_REGISTRY.starter;
  const planDoc = await PlanModel.findOne({ key: planKey }).lean().exec();

  const amountPaise = planDoc?.monthlyPriceINR ?? fallback.billing.amountPaise ?? 0;

  return {
    planKey: planDoc?.key ?? fallback.key,
    name: planDoc?.name ?? fallback.name,
    amountPaise,
    currencyCode: fallback.billing.currency
  };
};

