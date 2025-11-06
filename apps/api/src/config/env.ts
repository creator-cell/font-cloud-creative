import "dotenv/config";

const required = ["JWT_SECRET"] as const;

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/front-cloud-creative",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET!,
  superAdmins: (process.env.SUPERADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  openaiKey: process.env.OPENAI_API_KEY ?? "",
  openaiAssistantId: process.env.OPENAI_ASSISTANT_ID ?? "",
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  googleKey: process.env.GOOGLE_API_KEY ?? "",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  quotas: {
    free: Number(process.env.DEFAULT_FREE_QUOTA ?? 15000),
    starter: Number(process.env.STARTER_QUOTA ?? 300000),
    pro: Number(process.env.PRO_QUOTA ?? 1000000),
    team: Number(process.env.TEAM_QUOTA ?? 3000000)
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    prices: {
      starter: process.env.STRIPE_PRICE_STARTER ?? "",
      pro: process.env.STRIPE_PRICE_PRO ?? "",
      team: process.env.STRIPE_PRICE_TEAM ?? ""
    }
  },
  defaults: {
    provider: process.env.SYSTEM_DEFAULT_PROVIDER ?? "openai",
    model: process.env.SYSTEM_DEFAULT_MODEL ?? "gpt-4o-mini"
  }
};
