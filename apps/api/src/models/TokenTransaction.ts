import mongoose, { Schema, Types, model, InferSchemaType } from "mongoose";

const tokenTransactionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["grant", "spend", "hold", "hold_release", "refund", "adjustment"],
      required: true
    },
    amountTokens: { type: Number, required: true },
    source: { type: String },
    refId: { type: String },
    provider: { type: String },
    model: { type: String },
    currency: { type: String, default: "INR" },
    amountFiatCents: { type: Number, default: 0 },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

tokenTransactionSchema.index({ userId: 1, createdAt: -1 });
tokenTransactionSchema.index({ type: 1, createdAt: -1 });
tokenTransactionSchema.index({ refId: 1 });
tokenTransactionSchema.index({ userId: 1, refId: 1, type: 1 });
tokenTransactionSchema.index(
  { userId: 1, type: 1, source: 1, refId: 1 },
  { unique: true, sparse: true }
);
tokenTransactionSchema.index({ userId: 1, type: 1, createdAt: -1 });

export type TokenTransaction = InferSchemaType<typeof tokenTransactionSchema>;
export const TokenTransactionModel =
  mongoose.models.TokenTransaction ||
  model("TokenTransaction", tokenTransactionSchema);
export default TokenTransactionModel;
