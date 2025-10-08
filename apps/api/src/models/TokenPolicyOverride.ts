import { Schema, model, type Document, Types } from "mongoose";

export interface TokenPolicyOverrideDocument extends Document {
  userId: Types.ObjectId;
  monthKey: string;
  extraTokens: number;
  expiresAt: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenPolicyOverrideSchema = new Schema<TokenPolicyOverrideDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    monthKey: { type: String, required: true },
    extraTokens: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    reason: { type: String, required: true }
  },
  { timestamps: true }
);

tokenPolicyOverrideSchema.index({ userId: 1, monthKey: 1 }, { unique: true });

export const TokenPolicyOverrideModel = model<TokenPolicyOverrideDocument>(
  "TokenPolicyOverride",
  tokenPolicyOverrideSchema
);
