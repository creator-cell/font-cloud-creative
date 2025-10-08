import { env } from "../config/env";
import { AnthropicProvider } from "./anthropicProvider";
import { GoogleProvider } from "./googleProvider";
import { OllamaProvider } from "./ollamaProvider";
import { OpenAIProvider } from "./openaiProvider";
import { registerProvider } from "./registry";

export const bootstrapProviders = (): void => {
  if (env.openaiKey) {
    registerProvider(new OpenAIProvider());
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
