import { Schema, model, type Document } from "mongoose";

export interface DailyMetricsDocument extends Document {
  date: Date;
  dau: number;
  wau: number;
  mau: number;
  newSignups: number;
  activePaid: number;
  mrr: number;
  arr: number;
  arpu: number;
  churn: number;
  tokensInByProvider: Record<string, number>;
  tokensOutByProvider: Record<string, number>;
  planMix: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const dailyMetricsSchema = new Schema<DailyMetricsDocument>(
  {
    date: { type: Date, required: true, unique: true },
    dau: { type: Number, default: 0 },
    wau: { type: Number, default: 0 },
    mau: { type: Number, default: 0 },
    newSignups: { type: Number, default: 0 },
    activePaid: { type: Number, default: 0 },
    mrr: { type: Number, default: 0 },
    arr: { type: Number, default: 0 },
    arpu: { type: Number, default: 0 },
    churn: { type: Number, default: 0 },
    tokensInByProvider: { type: Schema.Types.Mixed, default: {} },
    tokensOutByProvider: { type: Schema.Types.Mixed, default: {} },
    planMix: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);


export const DailyMetricsModel = model<DailyMetricsDocument>("DailyMetrics", dailyMetricsSchema);
