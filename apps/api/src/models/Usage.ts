import { Schema, model, type Document, Types } from "mongoose";

export interface UsageDocument extends Document {
  userId: Types.ObjectId;
  monthKey: string;
  tokensIn: number;
  tokensOut: number;
  generations: number;
  softWarned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const usageSchema = new Schema<UsageDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    monthKey: { type: String, required: true },
    tokensIn: { type: Number, default: 0 },
    tokensOut: { type: Number, default: 0 },
    generations: { type: Number, default: 0 },
    softWarned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

usageSchema.index({ userId: 1, monthKey: 1 }, { unique: true });

export const UsageModel = model<UsageDocument>("Usage", usageSchema);
