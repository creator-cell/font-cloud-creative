import { createEmptyAnswer, type ProviderAnswer, type ChatAttachment } from "./types";

export type CreateTurnPayload = {
  sessionId: string;
  message: string;
  model: string;
  projectId?: string | null;
  attachments?: Array<
    Pick<ChatAttachment, "id" | "name" | "size" | "type"> & {
      dataUrl?: string;
    }
  >;
};

export type CreateTurnResponse = {
  turnId: string;
  streamUrl: string;
};

export type ProviderStartEvent = {
  provider: string;
  model: string;
};

export type ProviderDeltaEvent = {
  text_delta: string;
};

export type ProviderEndEvent = {
  tokens_in: number;
  tokens_out: number;
  cost_cents: number;
  latency_ms: number;
  finish_reason?: string;
};

export type ProviderErrorEvent = {
  message: string;
};

export type ProviderCompleteEvent = {
  turnId: string;
};

export type ChatStreamHandlers = {
  onStart?: (event: ProviderStartEvent) => void;
  onDelta?: (event: ProviderDeltaEvent) => void;
  onEnd?: (event: ProviderEndEvent) => void;
  onError?: (event: ProviderErrorEvent) => void;
  onComplete?: (event: ProviderCompleteEvent) => void;
};

export const createChatTurn = async (payload: CreateTurnPayload, signal?: AbortSignal) => {
  const response = await fetch("/api/chat/turns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unable to create chat turn");
  }

  return (await response.json()) as CreateTurnResponse;
};

export const openChatStream = (url: string, handlers: ChatStreamHandlers): EventSource => {
  const source = new EventSource(url);

  source.addEventListener("provider_start", (event) => {
    const data = safeParse<ProviderStartEvent>(event);
    if (data) handlers.onStart?.(data);
  });

  source.addEventListener("delta", (event) => {
    const data = safeParse<ProviderDeltaEvent>(event);
    if (data) handlers.onDelta?.(data);
  });

  source.addEventListener("provider_end", (event) => {
    const data = safeParse<ProviderEndEvent>(event);
    if (data) handlers.onEnd?.(data);
  });

  source.addEventListener("error", (event) => {
    const data = safeParse<ProviderErrorEvent>(event);
    if (data) {
      handlers.onError?.(data);
      return;
    }
    handlers.onError?.({ message: "Unknown streaming error" });
  });

  source.addEventListener("complete", (event) => {
    const data = safeParse<ProviderCompleteEvent>(event);
    if (data) handlers.onComplete?.(data);
  });

  return source;
};

const safeParse = <T>(event: MessageEvent): T | null => {
  try {
    const parsed = JSON.parse((event as MessageEvent<string>).data) as T;
    return parsed;
  } catch (error) {
    console.error("Failed to parse SSE payload", error);
    return null;
  }
};

export const createStreamingAnswer = (turnId: string, modelId: string): ProviderAnswer => {
  return {
    ...createEmptyAnswer(turnId, modelId),
    status: "streaming",
  };
};
