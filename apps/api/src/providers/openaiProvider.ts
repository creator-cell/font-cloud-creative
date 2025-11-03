import OpenAI from "openai";
import type { ResponseStreamParams } from "openai/resources/responses/responses";
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
    const inputMessages: ResponseStreamParams["input"] = [];
    if (params.system?.trim()) {
      inputMessages.push({
        role: "system",
        content: [{ type: "text", text: params.system }]
      });
    }
    inputMessages.push({
      role: "user",
      content: [{ type: "text", text: params.message }]
    });

    const streamParams: ResponseStreamParams = {
      model,
      input: inputMessages,
      temperature: 0.7,
      ...(typeof params.maxOutputTokens === "number"
        ? { max_output_tokens: params.maxOutputTokens }
        : {})
    };

    const stream = await this.client.responses.stream(streamParams, { signal: params.signal });

    let aggregatedText = "";
    let finishReason: string | undefined;

    try {
      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          const delta = event.delta ?? "";
          if (delta) {
            handlers.onDelta?.(delta);
            aggregatedText += delta;
          }
        } else if (event.type === "response.refusal.delta") {
          const delta = event.delta ?? "";
          if (delta) {
            handlers.onDelta?.(delta);
            aggregatedText += delta;
          }
        } else if (event.type === "response.completed") {
          finishReason = event.response.status ?? "completed";
        } else if (event.type === "response.error") {
          throw new Error(event.error?.message ?? "OpenAI streaming error");
        } else if (event.type === "response.failed") {
          throw new Error(event.error?.message ?? "OpenAI streaming failed");
        }
        if (params.signal?.aborted) {
          stream.abort();
          break;
        }
      }
    } catch (error) {
      if (params.signal?.aborted) {
        throw new Error("client_closed");
      }
      throw error;
    }

    let finalResponse;
    try {
      finalResponse = await stream.finalResponse();
    } catch (error) {
      if (params.signal?.aborted) {
        throw new Error("client_closed");
      }
      throw error;
    }
    const usage = finalResponse.usage;
    const textOutput = finalResponse.output_text ?? aggregatedText;
    const tokensIn =
      usage?.input_tokens ?? estimateTokens(`${params.system ?? ""}\n${params.message}`);
    const tokensOut = usage?.output_tokens ?? estimateTokens(textOutput);
    const latencyMs = Date.now() - startedAt;

    return {
      tokensIn,
      tokensOut,
      latencyMs,
      finishReason: finishReason ?? finalResponse.status ?? "completed"
    };
  }
}
