import { Schema, model, type Document } from "mongoose";

export interface FeatureFlagDocument extends Document {
  key: string;
  description?: string;
  enabled: boolean;
  rolloutPercent: number;
  audienceQuery?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const featureFlagSchema = new Schema<FeatureFlagDocument>(
  {
    key: { type: String, required: true, unique: true },
    description: { type: String },
    enabled: { type: Boolean, default: false },
    rolloutPercent: { type: Number, min: 0, max: 100, default: 0 },
    audienceQuery: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const FeatureFlagModel = model<FeatureFlagDocument>("FeatureFlag", featureFlagSchema);
