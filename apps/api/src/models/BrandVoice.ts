import { Schema, model, type Document, Types } from "mongoose";

export type StyleCard = {
  tone: string[];
  cadence: string;
  readingLevel: string;
  powerWords: string[];
  taboo: string[];
  dos: string[];
  donts: string[];
  language: string;
};

export interface BrandVoiceDocument extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  styleCard: StyleCard;
  createdAt: Date;
  updatedAt: Date;
}

const styleCardSchema = new Schema<StyleCard>(
  {
    tone: [{ type: String }],
    cadence: { type: String },
    readingLevel: { type: String },
    powerWords: [{ type: String }],
    taboo: [{ type: String }],
    dos: [{ type: String }],
    donts: [{ type: String }],
    language: { type: String, default: "en" }
  },
  { _id: false }
);

const brandVoiceSchema = new Schema<BrandVoiceDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    styleCard: { type: styleCardSchema, required: true }
  },
  { timestamps: true }
);

export const BrandVoiceModel = model<BrandVoiceDocument>("BrandVoice", brandVoiceSchema);
