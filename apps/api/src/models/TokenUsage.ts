import mongoose, { Schema, Types, model, InferSchemaType } from "mongoose";

const tokenUsageSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    conversationId: { type: Types.ObjectId, index: true },
    turnId: { type: Types.ObjectId },
    provider: { type: String },
    model: { type: String },
    tokensIn: { type: Number, default: 0 },
    tokensOut: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    estimatedCostCents: { type: Number, default: 0 },
    finalCostCents: { type: Number, default: 0 },
    currency: { type: String, enum: ["USD", "INR", "SAR"], default: "INR" },
    latencyMs: { type: Number, default: 0 },
    status: { type: String, enum: ["completed", "failed"], default: "completed" }
  },
  { timestamps: true }
);

tokenUsageSchema.index({ userId: 1, createdAt: -1 });
tokenUsageSchema.index({ conversationId: 1, createdAt: -1 });
tokenUsageSchema.index({ provider: 1, model: 1, createdAt: -1 });
tokenUsageSchema.index({ provider: 1, createdAt: -1 });

export type TokenUsage = InferSchemaType<typeof tokenUsageSchema>;
export const TokenUsageModel =
  mongoose.models.TokenUsage || model("TokenUsage", tokenUsageSchema);
export default TokenUsageModel;
