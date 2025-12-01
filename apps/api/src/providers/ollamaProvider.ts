// @ts-nocheck
import axios from "axios";
import { env } from "../config/env.js";
import { estimateTokens } from "../utils/tokenizer.js";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types.js";

export class OllamaProvider implements LLMProvider {
  public readonly id = "ollama" as const;

  async generate(model: string, payload: GenerationPayload): Promise<string> {
    const response = await axios.post(
      `${env.ollamaBaseUrl}/api/generate`,
      {
        model,
        prompt: `${payload.system}\n\n${payload.user}`,
        stream: false
      },
      { timeout: 60000 }
    );

    const content = response.data?.response;
    if (!content) {
      throw new Error("Ollama returned empty response");
    }

    return payload.json ? content.trim() : content;
  }

  async streamChat(
    model: string,
    params: ChatStreamParams,
    handlers: ChatStreamHandlers
  ): Promise<ChatStreamResult> {
    const startedAt = Date.now();
    const response = await axios.post(
      `${env.ollamaBaseUrl}/api/generate`,
      {
        model,
        prompt: `${params.system ?? ""}\n\n${params.message}`,
        max_tokens: params.maxOutputTokens,
        stream: false
      },
      { timeout: 60000 }
    );

    const content = (response.data?.response as string | undefined) ?? "";
    if (content) {
      handlers.onDelta(content);
    }

    const tokensIn = estimateTokens(`${params.system ?? ""}\n${params.message}`);
    const tokensOut = estimateTokens(content);
    const latencyMs = Date.now() - startedAt;

    return {
      tokensIn,
      tokensOut,
      latencyMs,
      finishReason: response.data?.done_reason ?? "stop"
    };
  }
}
