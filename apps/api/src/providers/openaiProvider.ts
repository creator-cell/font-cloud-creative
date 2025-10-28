import OpenAI from "openai";
import { env } from "../config/env";
import { estimateTokens } from "../utils/tokenizer";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types";

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
        { role: "system", content: payload.system },
        { role: "user", content: payload.user }
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
    const messages: Array<{ role: "system" | "user"; content: string }> = [];
    if (params.system) {
      messages.push({ role: "system", content: params.system });
    }
    messages.push({ role: "user", content: params.message });

    const response = await this.client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: params.maxOutputTokens,
      response_format: params.json ? { type: "json_object" } : undefined
    });

    const choice = response.choices[0];
    const content = choice?.message?.content ?? "";
    if (content) {
      handlers.onDelta(content);
    }

    const tokensIn =
      response.usage?.prompt_tokens ?? estimateTokens(`${params.system ?? ""}\n${params.message}`);
    const tokensOut = response.usage?.completion_tokens ?? estimateTokens(content);
    const latencyMs = Date.now() - startedAt;

    return {
      tokensIn,
      tokensOut,
      latencyMs,
      finishReason: choice?.finish_reason ?? undefined
    };
  }
}
