import { Schema, model, type Document } from "mongoose";

export interface OtpLoginDocument extends Document {
  phone: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
  usedAt?: Date;
}

const otpLoginSchema = new Schema<OtpLoginDocument>(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    usedAt: { type: Date }
  },
  { timestamps: true }
);

export const OtpLoginModel = model<OtpLoginDocument>("OtpLogin", otpLoginSchema);
