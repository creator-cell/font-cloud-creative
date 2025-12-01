import { env } from "../config/env.js";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types.js";

export class AnthropicProvider implements LLMProvider {
  public readonly id = "anthropic" as const;

  constructor() {
    if (!env.anthropicKey) {
      throw new Error("ANTHROPIC_API_KEY is required for Anthropic provider");
    }
  }

  async generate(): Promise<string> {
    throw new Error("Anthropic provider not implemented in this MVP");
  }

  async streamChat(): Promise<ChatStreamResult> {
    throw new Error("Anthropic chat streaming not implemented");
  }
}
