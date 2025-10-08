import { Schema, model, type Document, Types } from "mongoose";

export interface EvaluationScores {
  clarity: number;
  brandFit: number;
  compliance: number;
  originality: number;
  seo: number;
}

export interface EvaluationDocument extends Document {
  generationId: Types.ObjectId;
  scores: EvaluationScores;
  pass: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const scoresSchema = new Schema<EvaluationScores>(
  {
    clarity: { type: Number, min: 0, max: 1, required: true },
    brandFit: { type: Number, min: 0, max: 1, required: true },
    compliance: { type: Number, min: 0, max: 1, required: true },
    originality: { type: Number, min: 0, max: 1, required: true },
    seo: { type: Number, min: 0, max: 1, required: true }
  },
  { _id: false }
);

const evaluationSchema = new Schema<EvaluationDocument>(
  {
    generationId: { type: Schema.Types.ObjectId, ref: "Generation", required: true },
    scores: { type: scoresSchema, required: true },
    pass: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const EvaluationModel = model<EvaluationDocument>("Evaluation", evaluationSchema);
