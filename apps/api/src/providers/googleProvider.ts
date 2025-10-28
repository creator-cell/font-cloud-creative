import { env } from "../config/env";
import {
  ChatStreamHandlers,
  ChatStreamParams,
  ChatStreamResult,
  GenerationPayload,
  LLMProvider
} from "./types";

export class GoogleProvider implements LLMProvider {
  public readonly id = "google" as const;

  constructor() {
    if (!env.googleKey) {
      throw new Error("GOOGLE_API_KEY is required for Google provider");
    }
  }

  async generate(): Promise<string> {
    throw new Error("Google provider not implemented in this MVP");
  }

  async streamChat(): Promise<ChatStreamResult> {
    throw new Error("Google chat streaming not implemented");
  }
}
