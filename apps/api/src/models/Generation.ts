// @ts-nocheck
import { Schema, model, type Document, Types } from "mongoose";

export type GenerationType = "ad" | "carousel" | "blog";

export interface GenerationDocument extends Document {
  userId: Types.ObjectId;
  projectId?: Types.ObjectId;
  type: GenerationType;
  inputs: Record<string, unknown>;
  provider: string;
  model: string;
  output: Record<string, unknown>;
  warnings: string[];
  watermark?: string;
  tokensIn: number;
  tokensOut: number;
  createdAt: Date;
  updatedAt: Date;
}

const generationSchema = new Schema<GenerationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    type: { type: String, enum: ["ad", "carousel", "blog"], required: true },
    inputs: { type: Schema.Types.Mixed, required: true },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    output: { type: Schema.Types.Mixed, required: true },
    warnings: [{ type: String }],
    watermark: { type: String },
    tokensIn: { type: Number, required: true },
    tokensOut: { type: Number, required: true }
  },
  { timestamps: true }
);

export const GenerationModel = model<GenerationDocument>("Generation", generationSchema);
