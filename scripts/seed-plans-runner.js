#!/usr/bin/env node
require("dotenv/config");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGODB_URI =
  process.env.MONGODB_URI ?? process.env.MONGO_URI ?? "mongodb://localhost:27017/front-cloud-creative";

const planSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true },
    description: { type: String },
    billing: {
      type: {
        type: { type: String, enum: ["prepaid", "subscription"], required: true }
      },
      period: { type: String, enum: ["monthly", "yearly", "lifetime"] },
      priceCents: { type: Number, required: true, min: 0 },
      currency: { type: String, enum: ["INR", "USD", "SAR"], default: "INR" },
      trialDays: { type: Number, min: 0, default: 0 },
      taxInclusive: { type: Boolean, default: true }
    },
    tokens: {
      included: { type: Number, required: true, min: 0 },
      overagePricePer1K: { type: Number, required: true, min: 0 },
      dailyCap: { type: Number, min: 0, default: 0 },
      perMessageCap: { type: Number, min: 0, default: 0 }
    },
    limits: {
      maxConcurrentJobs: { type: Number, min: 0, default: 3 },
      contextWindowCap: { type: Number, min: 0, default: 0 },
      fileUploadSizeMB: { type: Number, min: 0, default: 25 },
      maxFilesPerJob: { type: Number, min: 0, default: 10 }
    },
    providers: {
      allowed: {
        type: [String],
        default: ["openai", "anthropic", "google", "ollama", "allam"],
        validate: [(value) => Array.isArray(value) && value.length > 0, "At least one provider required"]
      },
      modelAllowlist: { type: [String], default: [] },
      perModelMarkupPct: { type: Map, of: Number, default: {} }
    },
    features: { type: [String], default: ["api_access", "file_analysis"] },
    visibility: {
      public: { type: Boolean, default: true },
      sortOrder: { type: Number, default: 100 }
    },
    status: { type: String, enum: ["draft", "active", "archived"], default: "active" },
    effectiveFrom: { type: Date },
    effectiveTo: { type: Date }
  },
  { timestamps: true }
);

planSchema.index({ status: 1, "visibility.public": 1, "visibility.sortOrder": 1 });

const PlanModel = mongoose.models.Plan ?? mongoose.model("Plan", planSchema);

const plans = [
  {
    key: "free",
    name: "Free",
    billing: { type: "prepaid", priceCents: 0, currency: "INR" },
    tokens: { included: 15000, overagePricePer1K: 0 },
    providers: { allowed: ["openai", "anthropic", "google", "ollama", "allam"] },
    features: ["api_access", "file_analysis"],
    visibility: { public: true, sortOrder: 1 },
    status: "active"
  },
  {
    key: "starter",
    name: "Starter",
    billing: { type: "prepaid", priceCents: 19900, currency: "INR" },
    tokens: { included: 200000, overagePricePer1K: 150 },
    providers: { allowed: ["openai", "anthropic", "google", "ollama", "allam"] },
    features: ["api_access", "file_analysis"],
    visibility: { public: true, sortOrder: 10 },
    status: "active"
  },
  {
    key: "pro",
    name: "Pro",
    billing: { type: "subscription", period: "monthly", priceCents: 99900, currency: "INR", trialDays: 7 },
    tokens: { included: 1_200_000, overagePricePer1K: 120, dailyCap: 100_000 },
    limits: { maxConcurrentJobs: 5, fileUploadSizeMB: 50, maxFilesPerJob: 20 },
    providers: { allowed: ["openai", "anthropic", "google", "ollama", "allam"] },
    features: ["api_access", "file_analysis", "priority_support"],
    visibility: { public: true, sortOrder: 20 },
    status: "active"
  },
  {
    key: "team",
    name: "Team",
    billing: { type: "subscription", period: "monthly", priceCents: 198000, currency: "INR", trialDays: 14 },
    tokens: { included: 3_000_000, overagePricePer1K: 100, dailyCap: 250_000 },
    limits: { maxConcurrentJobs: 10, fileUploadSizeMB: 100, maxFilesPerJob: 40 },
    providers: { allowed: ["openai", "anthropic", "google", "ollama", "allam"] },
    features: ["api_access", "file_analysis", "priority_support", "mfa_required"],
    visibility: { public: true, sortOrder: 30 },
    status: "active"
  }
];

(async () => {
  await mongoose.connect(MONGODB_URI);

  for (const plan of plans) {
    const result = await PlanModel.updateOne({ key: plan.key }, { $setOnInsert: plan }, { upsert: true });
    if (result.upsertedCount && result.upsertedCount > 0) {
      console.log(`Inserted plan '${plan.key}'`);
    } else {
      console.log(`Plan '${plan.key}' already exists`);
    }
  }

  await mongoose.disconnect();
})();
