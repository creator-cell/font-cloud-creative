// @ts-nocheck
import OpenAI from "openai";
import { env } from "../config/env.js";
import { estimateTokens } from "../utils/tokenizer.js";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types.js";

export class OpenAIProvider implements LLMProvider {
  public readonly id = "openai" as const;
  private readonly client: OpenAI;

  constructor() {
    if (!env.openaiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAI provider");
    }
    this.client = new OpenAI({ apiKey: env.openaiKey });
  }

  async generate(model: string, payload: GenerationPayload): Promise<string> {
    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system" as const, content: payload.system },
        { role: "user" as const, content: payload.user }
      ],
      temperature: 0.7,
      response_format: payload.json ? { type: "json_object" } : undefined
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }
    return content;
  }

  async streamChat(
    model: string,
    params: ChatStreamParams,
    handlers: ChatStreamHandlers
  ): Promise<ChatStreamResult> {
    const startedAt = Date.now();

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        ...(params.system?.trim() ? [{ role: "system" as const, content: params.system }] : []),
        { role: "user" as const, content: params.message }
      ],
      temperature: 0.7,
      max_tokens: params.maxOutputTokens,
      stream: true
    }, { signal: params.signal });

    let aggregatedText = "";
    let finishReason: string | undefined;

    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          handlers.onDelta?.(content);
          aggregatedText += content;
        }
        if (chunk.choices[0]?.finish_reason) {
          finishReason = chunk.choices[0].finish_reason;
        }
        if (params.signal?.aborted) {
          break;
        }
      }
    } catch (error) {
      if (params.signal?.aborted) {
        throw new Error("client_closed");
      }
      throw error;
    }

    const tokensIn = estimateTokens(`${params.system ?? ""}\n${params.message}`);
    const tokensOut = estimateTokens(aggregatedText);
    const latencyMs = Date.now() - startedAt;

    return {
      tokensIn,
      tokensOut,
      latencyMs,
      finishReason: finishReason ?? "completed"
    };
  }
}