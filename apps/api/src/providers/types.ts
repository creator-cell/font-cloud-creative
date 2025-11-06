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

export type ChatAttachment = {
  id: string;
  name: string;
  size: number;
  type?: string;
  dataUrl?: string;
};

export type ChatStreamParams = {
  system?: string;
  message: string;
  maxOutputTokens: number;
  signal?: AbortSignal;
  json?: boolean;
  attachments?: ChatAttachment[];
  threadId?: string;
  assistantId?: string;
};

export type ChatStreamResult = {
  tokensIn: number;
  tokensOut: number;
  latencyMs?: number;
  finishReason?: string;
  text: string;
};

export type ChatMessageContent = 
  | string 
  | Array<{
      type: "text" | "image_url" | "file";
      text?: string;
      image_url?: string;
      file_id?: string;
    }>;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: ChatMessageContent;
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
