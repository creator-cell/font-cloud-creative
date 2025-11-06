import OpenAI from "openai";
import { env } from "../../config/env.js";

let cachedClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (!env.openaiKey) {
    throw new Error("OPENAI_API_KEY is required to initialize OpenAI client");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: env.openaiKey });
  }

  return cachedClient;
};
