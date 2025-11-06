export enum Provider {
  OpenAI = "openai",
  Anthropic = "anthropic",
  Google = "google",
  Ollama = "ollama",
  Allam = "allam",
}

export type ProviderModel = {
  id: string;
  label: string;
  provider: Provider;
};

export type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
};

export type ProviderAnswer = {
  turnId: string;
  provider: Provider;
  model: string;
  content: string;
  status: "idle" | "streaming" | "complete" | "error" | "timeout";
  tokensIn?: number;
  tokensOut?: number;
  costCents?: number;
  latencyMs?: number;
  finishReason?: string;
  errorMessage?: string;
  startedAt: number;
  completedAt?: number;
};

export type ChatTurn = {
  id: string;
  userMessage: string;
  answer: ProviderAnswer;
  createdAt: number;
  projectId?: string;
  attachments: ChatAttachment[];
};

export type ChatSession = {
  id: string;
  turns: ChatTurn[];
  activeProjectId: string | null;
  lastModelId: string;
};

export type ChatState = {
  session: ChatSession;
  isStreaming: boolean;
  inputValue: string;
};

export type ChatAction =
  | { type: "set-input"; value: string }
  | { type: "append-turn"; turn: ChatTurn }
  | { type: "append-answer-content"; turnId: string; delta: string }
  | { type: "update-answer"; turnId: string; patch: Partial<ProviderAnswer> }
  | { type: "set-streaming"; value: boolean }
  | { type: "set-session"; session: ChatSession }
  | { type: "update-last-model"; modelId: string }
  | { type: "set-active-project"; projectId: string | null }
  | { type: "replace-turn"; turn: ChatTurn }
  | { type: "prepend-turns"; turns: ChatTurn[] };

export const PROVIDER_MODELS: ProviderModel[] = [
  {
    id: "openai:gpt-4.1-mini",
    label: "OpenAI · GPT-4.1 Mini",
    provider: Provider.OpenAI,
  },
  {
    id: "openai:gpt-4o",
    label: "OpenAI · GPT-4o",
    provider: Provider.OpenAI,
  },
  {
    id: "openai:gpt-4-turbo",
    label: "OpenAI · GPT-4 Turbo",
    provider: Provider.OpenAI,
  },
  {
    id: "anthropic:claude-3-5-sonnet",
    label: "Anthropic · Claude 3.5 Sonnet",
    provider: Provider.Anthropic,
  },
  {
    id: "google:gemini-1.5-pro",
    label: "Google · Gemini 1.5 Pro",
    provider: Provider.Google,
  },
  {
    id: "ollama:llama3:8b",
    label: "Ollama · Llama 3 8B",
    provider: Provider.Ollama,
  },
  {
    id: "allam:34b",
    label: "ALLam · 34B",
    provider: Provider.Allam,
  },
];

export const getProviderFromModel = (modelId: string): Provider => {
  const matched = PROVIDER_MODELS.find((model) => model.id === modelId);
  if (matched) return matched.provider;

  const [provider] = modelId.split(":");
  switch (provider) {
    case Provider.OpenAI:
    case Provider.Anthropic:
    case Provider.Google:
    case Provider.Ollama:
    case Provider.Allam:
      return provider;
    default:
      return Provider.OpenAI;
  }
};

export const createEmptyAnswer = (turnId: string, modelId: string): ProviderAnswer => ({
  turnId,
  provider: getProviderFromModel(modelId),
  model: modelId,
  content: "",
  status: "idle",
  startedAt: Date.now(),
});
