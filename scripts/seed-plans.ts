#!/usr/bin/env ts-node
import "dotenv/config";
import mongoose from "mongoose";
import PlanModel from "../src/models/Plan";
import { planSchema } from "../src/lib/validation/plan.schema";

const MONGODB_URI =
  process.env.MONGODB_URI ?? process.env.MONGO_URI ?? "mongodb://localhost:27017/front-cloud-creative";

if (!MONGODB_URI) {
  console.error("No MongoDB connection string provided.");
  process.exit(1);
}

const plans = [
  {
    key: "free",
    name: "Free",
    billing: {
      type: "prepaid" as const,
      priceCents: 0,
      currency: "INR" as const
    },
    tokens: {
      included: 15_000,
      overagePricePer1K: 0
    },
    providers: {
      allowed: ["openai", "anthropic", "google", "ollama", "allam"]
    },
    features: ["api_access", "file_analysis"],
    visibility: { public: true, sortOrder: 1 },
    status: "active" as const
  },
  {
    key: "starter",
    name: "Starter",
    billing: {
      type: "prepaid" as const,
      priceCents: 19_900,
      currency: "INR" as const
    },
    tokens: {
      included: 200_000,
      overagePricePer1K: 150
    },
    providers: {
      allowed: ["openai", "anthropic", "google", "ollama", "allam"]
    },
    features: ["api_access", "file_analysis"],
    visibility: { public: true, sortOrder: 10 },
    status: "active" as const
  },
  {
    key: "pro",
    name: "Pro",
    billing: {
      type: "subscription" as const,
      period: "monthly" as const,
      priceCents: 99_900,
      currency: "INR" as const,
      trialDays: 7
    },
    tokens: {
      included: 1_200_000,
      overagePricePer1K: 120,
      dailyCap: 100_000
    },
    limits: {
      maxConcurrentJobs: 5,
      fileUploadSizeMB: 50,
      maxFilesPerJob: 20
    },
    providers: {
      allowed: ["openai", "anthropic", "google", "ollama", "allam"]
    },
    features: ["api_access", "file_analysis", "priority_support"],
    visibility: { public: true, sortOrder: 20 },
    status: "active" as const
  },
  {
    key: "team",
    name: "Team",
    billing: {
      type: "subscription" as const,
      period: "monthly" as const,
      priceCents: 198_000,
      currency: "INR" as const,
      trialDays: 14
    },
    tokens: {
      included: 3_000_000,
      overagePricePer1K: 100,
      dailyCap: 250_000
    },
    limits: {
      maxConcurrentJobs: 10,
      contextWindowCap: 0,
      fileUploadSizeMB: 100,
      maxFilesPerJob: 40
    },
    providers: {
      allowed: ["openai", "anthropic", "google", "ollama", "allam"]
    },
    features: ["api_access", "file_analysis", "priority_support", "mfa_required"],
    visibility: { public: true, sortOrder: 30 },
    status: "active" as const
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);

  for (const plan of plans) {
    const parsed = planSchema.parse(plan);

    const payload = { ...parsed } as typeof parsed;
    if (!payload.limits || Object.keys(payload.limits).length === 0) {
      delete (payload as Record<string, unknown>).limits;
    }
    if (payload.providers.modelAllowlist && payload.providers.modelAllowlist.length === 0) {
      delete (payload.providers as Record<string, unknown>).modelAllowlist;
    }
    if (
      payload.providers.perModelMarkupPct &&
      Object.keys(payload.providers.perModelMarkupPct).length === 0
    ) {
      delete (payload.providers as Record<string, unknown>).perModelMarkupPct;
    }

    const result = await PlanModel.updateOne(
      { key: payload.key },
      { $setOnInsert: payload },
      { upsert: true }
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      console.log(`Inserted plan: ${payload.key}`);
    } else {
      console.log(`Plan '${payload.key}' already exists. Skipping insert.`);
    }
  }

  await mongoose.disconnect();
}

run()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed", error);
    void mongoose.disconnect().finally(() => process.exit(1));
  });
