import { Schema, model, type Document } from "mongoose";

export interface PlanDocument extends Document {
  key: "free" | "starter" | "pro" | "team";
  name: string;
  monthlyPriceINR: number;
  monthlyTokens: number;
  features: string[];
  premiumModelAccess: string[];
  overagePer1K: number;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<PlanDocument>(
  {
    key: { type: String, enum: ["free", "starter", "pro", "team"], unique: true, required: true },
    name: { type: String, required: true },
    monthlyPriceINR: { type: Number, required: true },
    monthlyTokens: { type: Number, required: true },
    features: [{ type: String }],
    premiumModelAccess: [{ type: String }],
    overagePer1K: { type: Number, default: 0 },
    stripePriceId: { type: String }
  },
  { timestamps: true }
);

export const PlanModel = model<PlanDocument>("Plan", planSchema);
