import { PlanTier } from "../constants/plans";

export type ProviderId = "openai" | "anthropic" | "google" | "ollama";

export type GenerationPayload = {
  system: string;
  user: string;
  json: boolean;
};

export interface LLMProvider {
  id: ProviderId;
  generate(model: string, payload: GenerationPayload): Promise<string>;
}

export interface ProviderModel {
  id: string;
  label: string;
  capabilities: Array<"text" | "json" | "vision">;
  minPlan: PlanTier;
  estCostPer1K: number;
  provider: ProviderId;
}

export interface ProviderSelection {
  provider: ProviderId;
  model: string;
}
