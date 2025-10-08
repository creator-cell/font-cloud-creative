import axios from "axios";
import { env } from "../config/env";
import { GenerationPayload, LLMProvider } from "./types";

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
}
