import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const providerPriceSchema = new Schema(
  {
    provider: { type: String, required: true },
    model: { type: String, required: true },
    inputPer1kCents: { type: Number, default: 0 },
    outputPer1kCents: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    effectiveFrom: { type: Date, default: () => new Date() },
    effectiveTo: { type: Date }
  },
  { timestamps: true }
);

providerPriceSchema.index({ provider: 1, model: 1, effectiveFrom: -1 }, { unique: true });

export type ProviderPrice = InferSchemaType<typeof providerPriceSchema>;
export const ProviderPriceModel =
  mongoose.models.ProviderPrice || model("ProviderPrice", providerPriceSchema);
export default ProviderPriceModel;
