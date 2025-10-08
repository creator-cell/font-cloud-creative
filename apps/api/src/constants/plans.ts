export const PLAN_ORDER = ["free", "starter", "pro", "team"] as const;

export type PlanTier = (typeof PLAN_ORDER)[number];

export const comparePlans = (current: PlanTier, required: PlanTier): boolean => {
  const currentIdx = PLAN_ORDER.indexOf(current);
  const requiredIdx = PLAN_ORDER.indexOf(required);
  return currentIdx >= requiredIdx;
};
