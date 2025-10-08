import { Schema, model, type Document } from "mongoose";

export interface ProviderCostDocument extends Document {
  provider: string;
  modelId: string;
  costPer1KIn: number;
  costPer1KOut: number;
  effectiveFrom: Date;
  createdAt: Date;
  updatedAt: Date;
}

const providerCostSchema = new Schema<ProviderCostDocument>(
  {
    provider: { type: String, required: true },
    modelId: { type: String, required: true },
    costPer1KIn: { type: Number, required: true },
    costPer1KOut: { type: Number, required: true },
    effectiveFrom: { type: Date, required: true }
  },
  { timestamps: true }
);

providerCostSchema.index({ provider: 1, modelId: 1, effectiveFrom: -1 });

export const ProviderCostModel = model<ProviderCostDocument>("ProviderCost", providerCostSchema);
