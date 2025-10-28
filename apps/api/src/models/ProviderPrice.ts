import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const providerPriceSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ["openai", "anthropic", "google", "ollama", "allam"]
    },
    model: { type: String, required: true },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "INR", "SAR"]
    },
    inputPer1kCents: { type: Number, required: true, min: 0 },
    outputPer1kCents: { type: Number, required: true, min: 0 },
    effectiveFrom: { type: Date, default: () => new Date(), required: true },
    effectiveTo: { type: Date },
    notes: { type: String }
  },
  { timestamps: true }
);

providerPriceSchema.index(
  { provider: 1, model: 1, currency: 1, effectiveFrom: -1 },
  { unique: true }
);
providerPriceSchema.index({
  provider: 1,
  model: 1,
  effectiveFrom: -1,
  effectiveTo: -1
});

export type ProviderPrice = InferSchemaType<typeof providerPriceSchema>;
export const ProviderPriceModel =
  mongoose.models.ProviderPrice || model("ProviderPrice", providerPriceSchema);
export default ProviderPriceModel;
