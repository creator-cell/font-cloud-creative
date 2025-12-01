import type { PlanTier } from "../../constants/plans.js";
import { getPlanBillingInfo } from "../planRegistry.js";
import { createAmazonCharge, type AmazonChargeResult } from "./amazonPayService.js";

const truncateSoftDescriptor = (value: string): string => value.slice(0, 16);

export const chargePlanWithAmazon = async (
  planKey: PlanTier,
  customerEmail: string
): Promise<AmazonChargeResult> => {
  const { amountPaise, currencyCode, name } = await getPlanBillingInfo(planKey);

  const referenceId = `plan-${planKey}-${Date.now()}`;
  const softDescriptor = truncateSoftDescriptor(`FrontCloud ${planKey}`);
  const note = `Subscription charge for ${name}`;

  return createAmazonCharge({
    amountPaise,
    currencyCode,
    referenceId,
    softDescriptor,
    note,
    customerEmail
  });
};

