import { Schema, model, type Document, Types } from "mongoose";
import type { ProviderId } from "../providers/types";
import type { PlanTier } from "../constants/plans";
import type { Role } from "../types/express";

export interface PreferredModel {
  provider: ProviderId;
  model: string;
}

export interface UserDocument extends Document {
  email: string;
  name?: string;
  authIds: {
    nextAuthId?: string;
    googleId?: string;
  };
  passwordHash?: string;
  plan: PlanTier;
  preferredProvider?: ProviderId;
  preferredModel?: string;
  seats: number;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String },
    authIds: {
      nextAuthId: { type: String },
      googleId: { type: String }
    },
    passwordHash: { type: String },
    plan: { type: String, enum: ["free", "starter", "pro", "team"], default: "free" },
    preferredProvider: { type: String, enum: ["openai", "anthropic", "google", "ollama"] },
    preferredModel: { type: String },
    seats: { type: Number, default: 1 },
    roles: {
      type: [
        {
          type: String,
          enum: ["owner", "admin", "analyst", "support", "billing", "user"]
        }
      ],
      default: ["user"]
    }
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
