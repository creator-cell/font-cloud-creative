import { env } from "../config/env.js";
import { comparePlans, type PlanTier } from "../constants/plans.js";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider,
  ProviderId,
  ProviderModel,
  ProviderSelection
} from "./types.js";

const providerInstances = new Map<ProviderId, LLMProvider>();

export const MODELS: ProviderModel[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    capabilities: ["text", "json"],
    minPlan: "free",
    estCostPer1K: 0.15,
    provider: "openai"
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    capabilities: ["text", "json", "vision"],
    minPlan: "pro",
    estCostPer1K: 15,
    provider: "openai"
  },
  {
    id: "gpt-4o-full",
    label: "GPT-4o Full",
    capabilities: ["text", "json", "vision"],
    minPlan: "pro",
    estCostPer1K: 30,
    provider: "openai"
  },
  {
    id: "claude-3-haiku",
    label: "Claude 3 Haiku",
    capabilities: ["text", "json"],
    minPlan: "starter",
    estCostPer1K: 0.8,
    provider: "anthropic"
  },
  {
    id: "claude-3-sonnet",
    label: "Claude 3 Sonnet",
    capabilities: ["text", "json", "vision"],
    minPlan: "pro",
    estCostPer1K: 15,
    provider: "anthropic"
  },
  {
    id: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    capabilities: ["text", "json", "vision"],
    minPlan: "starter",
    estCostPer1K: 0.35,
    provider: "google"
  },
  {
    id: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    capabilities: ["text", "json", "vision"],
    minPlan: "pro",
    estCostPer1K: 10,
    provider: "google"
  },
  {
    id: "llama3-8b",
    label: "Llama 3 8B (Ollama)",
    capabilities: ["text", "json"],
    minPlan: "free",
    estCostPer1K: 0,
    provider: "ollama"
  },
  {
    id: "mixtral-8x7b",
    label: "Mixtral 8x7B (Ollama)",
    capabilities: ["text", "json"],
    minPlan: "starter",
    estCostPer1K: 0,
    provider: "ollama"
  }
];

export const registerProvider = (provider: LLMProvider): void => {
  providerInstances.set(provider.id, provider);
};

export const resolveProvider = (provider: ProviderId): LLMProvider => {
  const instance = providerInstances.get(provider);
  if (!instance) {
    throw new Error(`Provider ${provider} is not configured`);
  }
  return instance;
};

export const getModelInfo = (provider: ProviderId, model: string): ProviderModel | undefined =>
  MODELS.find((m) => m.provider === provider && m.id === model);

export const getModelsForPlan = (plan: PlanTier): ProviderModel[] =>
  MODELS.filter((model) => comparePlans(plan, model.minPlan));

type ChoiceContext = {
  request?: ProviderSelection | null;
  projectOverride?: ProviderSelection | null;
  userDefault?: ProviderSelection | null;
};

const normalizeSelection = (selection?: ProviderSelection | null): ProviderSelection | null => {
  if (!selection) return null;
  const info = getModelInfo(selection.provider, selection.model);
  if (!info) return null;
  return selection;
};

const firstAvailable = (plan: PlanTier, selections: Array<ProviderSelection | null>): ProviderSelection => {
  for (const selection of selections) {
    if (!selection) continue;
    const info = getModelInfo(selection.provider, selection.model);
    if (!info) continue;
    if (!comparePlans(plan, info.minPlan)) continue;
    return selection;
  }

  const fallbackInfo = getModelInfo(env.defaults.provider as ProviderId, env.defaults.model);
  if (fallbackInfo && comparePlans(plan, fallbackInfo.minPlan)) {
    return { provider: fallbackInfo.provider, model: fallbackInfo.id };
  }

  const allowed = getModelsForPlan(plan);
  if (allowed.length === 0) {
    throw new Error(`No models available for plan ${plan}`);
  }
  return { provider: allowed[0].provider, model: allowed[0].id };
};

export const chooseModelForRequest = (plan: PlanTier, context: ChoiceContext): ProviderSelection => {
  const selections: Array<ProviderSelection | null> = [
    normalizeSelection(context.request),
    normalizeSelection(context.projectOverride),
    normalizeSelection(context.userDefault)
  ];
  return firstAvailable(plan, selections);
};

export const listProviders = (): ProviderId[] => ["openai", "anthropic", "google", "ollama"];

export const callProvider = async (
  provider: ProviderId,
  model: string,
  payload: GenerationPayload
): Promise<string> => {
  const instance = resolveProvider(provider);
  return instance.generate(model, payload);
};

export const streamProviderChat = async (
  provider: ProviderId,
  model: string,
  params: ChatStreamParams,
  handlers: ChatStreamHandlers
): Promise<ChatStreamResult> => {
  const instance = resolveProvider(provider);
  if (!instance.streamChat) {
    throw new Error(`Provider ${provider} does not support chat streaming`);
  }
  return instance.streamChat(model, params, handlers);
};
