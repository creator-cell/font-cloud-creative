import { env } from "../config/env.js";
import { AnthropicProvider } from "./anthropicProvider.js";
import { GoogleProvider } from "./googleProvider.js";
import { OllamaProvider } from "./ollamaProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";
import { registerProvider } from "./registry.js";

export const bootstrapProviders = (): void => {
  try {
    if (!env.openaiKey) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    registerProvider(new OpenAIProvider());
  } catch (err) {
    console.error("Failed to initialize OpenAI provider:", (err as Error).message);
  }

  try {
    if (env.anthropicKey) {
      registerProvider(new AnthropicProvider());
    }
  } catch (err) {
    console.warn("Skipping Anthropic provider:", (err as Error).message);
  }

  try {
    if (env.googleKey) {
      registerProvider(new GoogleProvider());
    }
  } catch (err) {
    console.warn("Skipping Google provider:", (err as Error).message);
  }

  registerProvider(new OllamaProvider());
};
