import { Types } from "mongoose";
import { creditWalletBalance } from "./walletService.js";

export type PlanSnapshot = {
  key: string;
  name: string;
  billing: { currency: "INR" | "USD" | "SAR" };
  tokens: { included: number };
};

export async function allocateOnRegistration(
  userId: Types.ObjectId,
  plan: PlanSnapshot,
  reference?: string,
  source: "registration" | "plan-upgrade" = "registration"
) {
  if (!plan?.tokens?.included || plan.tokens.included <= 0) {
    return { credited: 0, balance: 0, idempotent: false };
  }

  const refId = reference ?? `plan:${plan.key}`;

  return creditWalletBalance({
    userId,
    amountTokens: plan.tokens.included,
    source,
    refId,
    currency: plan.billing.currency,
    meta: {
      planKey: plan.key,
      planName: plan.name
    }
  });
}
