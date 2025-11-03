import { Provider } from "@/src/lib/chat/types";

export type ModelOption = {
  value: string;
  label: string;
  provider: string;
  modelId: string;
  available: boolean;
  minPlan: string;
};

export const DEFAULT_MODEL_VALUE = "openai:gpt-4o-mini";

export const formatProviderLabel = (provider: string): string =>
  provider.charAt(0).toUpperCase() + provider.slice(1);

export const formatPlanName = (plan: string): string =>
  plan.charAt(0).toUpperCase() + plan.slice(1);

export const formatModelValue = (provider: string, modelId: string): string => `${provider}:${modelId}`;

export const parseModelValue = (value: string): { provider: string; modelId: string } => {
  const [provider, ...rest] = value.split(":");
  return {
    provider: provider ?? "",
    modelId: rest.join(":"),
  };
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

export const formatCurrency = (cents: number): string =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

export const resolveProviderFromModel = (modelId: string): Provider => {
  const [provider] = modelId.split(":");
  switch (provider) {
    case Provider.OpenAI:
    case Provider.Anthropic:
    case Provider.Google:
    case Provider.Ollama:
    case Provider.Allam:
      return provider;
    default: {
      if (modelId.startsWith("gpt-")) return Provider.OpenAI;
      if (modelId.startsWith("claude")) return Provider.Anthropic;
      if (modelId.startsWith("gemini")) return Provider.Google;
      if (modelId.startsWith("llama") || modelId.startsWith("mixtral")) return Provider.Ollama;
      return Provider.OpenAI;
    }
  }
};
