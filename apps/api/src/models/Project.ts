import { Schema, model, type Document, Types } from "mongoose";
import type { ProviderId } from "../providers/types";

export interface ProjectDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  modelOverride?: {
    provider: ProviderId;
    model: string;
  };
  brandVoiceIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    modelOverride: {
      provider: { type: String, enum: ["openai", "anthropic", "google", "ollama"] },
      model: { type: String }
    },
    brandVoiceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "BrandVoice" }],
      default: []
    }
  },
  { timestamps: true }
);

export const ProjectModel = model<ProjectDocument>("Project", projectSchema);
