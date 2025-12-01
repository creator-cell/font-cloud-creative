import { comparePlans, type PlanTier } from "../constants/plans.js";
import { MODELS } from "../providers/registry.js";
import type { ProviderId } from "../providers/types.js";

export interface ProviderModelsResponse {
  provider: ProviderId;
  models: Array<{
    id: string;
    label: string;
    capabilities: Array<"text" | "json" | "vision">;
    minPlan: PlanTier;
    estCostPer1K: number;
    available: boolean;
  }>;
}

export const listModelsForPlan = (plan: PlanTier): ProviderModelsResponse[] => {
  const grouped = new Map<ProviderId, ProviderModelsResponse["models"]>();

  MODELS.forEach((model) => {
    if (!grouped.has(model.provider)) {
      grouped.set(model.provider, []);
    }
    grouped.get(model.provider)!.push({
      id: model.id,
      label: model.label,
      capabilities: model.capabilities,
      minPlan: model.minPlan,
      estCostPer1K: model.estCostPer1K,
      available: comparePlans(plan, model.minPlan)
    });
  });

  return Array.from(grouped.entries()).map(([provider, models]) => ({ provider, models }));
};
