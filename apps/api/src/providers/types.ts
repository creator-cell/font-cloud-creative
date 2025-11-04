import { PlanTier } from "../constants/plans";

export type ProviderId = "openai" | "anthropic" | "google" | "ollama";

export type GenerationPayload = {
  system: string;
  user: string;
  json: boolean;
};

export interface ChatStreamHandlers {
  onDelta: (text: string) => void;
}

export type ChatStreamParams = {
  system?: string;
  message: string;
  maxOutputTokens: number;
  signal?: AbortSignal;
  json?: boolean;
};

export type ChatStreamResult = {
  tokensIn: number;
  tokensOut: number;
  latencyMs?: number;
  finishReason?: string;
  text: string;
};

export interface LLMProvider {
  id: ProviderId;
  generate(model: string, payload: GenerationPayload): Promise<string>;
  streamChat?(
    model: string,
    params: ChatStreamParams,
    handlers: ChatStreamHandlers
  ): Promise<ChatStreamResult>;
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
