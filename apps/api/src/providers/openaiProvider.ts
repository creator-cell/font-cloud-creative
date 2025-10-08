import OpenAI from "openai";
import { env } from "../config/env";
import { GenerationPayload, LLMProvider } from "./types";

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
}
