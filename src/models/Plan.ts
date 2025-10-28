import mongoose, { Schema, model, type Document } from "mongoose";

export type PlanBillingType = "prepaid" | "subscription";
export type PlanBillingPeriod = "monthly" | "yearly" | "lifetime";
export type PlanCurrency = "INR" | "USD" | "SAR";
export type PlanStatus = "draft" | "active" | "archived";

export interface PlanBilling {
  type: PlanBillingType;
  period?: PlanBillingPeriod;
  priceCents: number;
  currency: PlanCurrency;
  trialDays?: number;
  taxInclusive?: boolean;
}

export interface PlanTokens {
  included: number;
  overagePricePer1K: number;
  dailyCap?: number;
  perMessageCap?: number;
}

export interface PlanLimits {
  maxConcurrentJobs?: number;
  contextWindowCap?: number;
  fileUploadSizeMB?: number;
  maxFilesPerJob?: number;
}

export interface PlanProviders {
  allowed: string[];
  modelAllowlist?: string[];
  perModelMarkupPct?: Record<string, number>;
}

export interface PlanVisibility {
  public: boolean;
  sortOrder: number;
}

export interface Plan {
  key: string;
  name: string;
  description?: string;
  billing: PlanBilling;
  tokens: PlanTokens;
  limits?: PlanLimits;
  providers: PlanProviders;
  features?: string[];
  visibility: PlanVisibility;
  status: PlanStatus;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PlanDocument = Plan & Document;

const planSchema = new Schema<PlanDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: undefined },
    billing: {
      type: new Schema<PlanBilling>(
        {
          type: {
            type: String,
            enum: ["prepaid", "subscription"],
            required: true
          },
          period: {
            type: String,
            enum: ["monthly", "yearly", "lifetime"],
            required: function () {
              return (this as PlanDocument).billing?.type === "subscription";
            }
          },
          priceCents: {
            type: Number,
            required: true,
            min: 0
          },
          currency: {
            type: String,
            enum: ["INR", "USD", "SAR"],
            default: "INR"
          },
          trialDays: {
            type: Number,
            min: 0,
            default: 0
          },
          taxInclusive: {
            type: Boolean,
            default: true
          }
        },
        { _id: false }
      ),
      required: true
    },
    tokens: {
      type: new Schema<PlanTokens>(
        {
          included: { type: Number, required: true, min: 0 },
          overagePricePer1K: { type: Number, required: true, min: 0 },
          dailyCap: { type: Number, min: 0, default: 0 },
          perMessageCap: { type: Number, min: 0, default: 0 }
        },
        { _id: false }
      ),
      required: true
    },
    limits: {
      type: new Schema<PlanLimits>(
        {
          maxConcurrentJobs: { type: Number, min: 0, default: 3 },
          contextWindowCap: { type: Number, min: 0, default: 0 },
          fileUploadSizeMB: { type: Number, min: 0, default: 25 },
          maxFilesPerJob: { type: Number, min: 0, default: 10 }
        },
        { _id: false }
      ),
      default: undefined
    },
    providers: {
      type: new Schema<PlanProviders>(
        {
          allowed: {
            type: [String],
            default: ["openai", "anthropic", "google", "ollama", "allam"],
            validate: {
              validator: (value: string[]) => Array.isArray(value) && value.length > 0,
              message: "Providers allowed must include at least one entry."
            }
          },
          modelAllowlist: {
            type: [String],
            default: []
          },
          perModelMarkupPct: {
            type: Map,
            of: Number,
            default: {}
          }
        },
        { _id: false }
      ),
      required: true
    },
    features: {
      type: [String],
      default: ["api_access", "file_analysis"]
    },
    visibility: {
      type: new Schema<PlanVisibility>(
        {
          public: { type: Boolean, default: true },
          sortOrder: { type: Number, default: 100 }
        },
        { _id: false }
      ),
      default: { public: true, sortOrder: 100 }
    },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true
    },
    effectiveFrom: { type: Date },
    effectiveTo: { type: Date }
  },
  { timestamps: true }
);

planSchema.index({ status: 1, "visibility.public": 1, "visibility.sortOrder": 1 });

export const PlanModel =
  mongoose.models.Plan ?? model<PlanDocument>("Plan", planSchema);

export default PlanModel;
