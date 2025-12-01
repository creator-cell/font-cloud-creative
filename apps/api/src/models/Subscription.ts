import { Schema, model, type Document, Types } from "mongoose";
import type { PlanTier } from "../constants/plans.js";

export interface SubscriptionDocument extends Document {
  userId: Types.ObjectId;
  plan: PlanTier;
  status: "active" | "trialing" | "canceled" | "past_due" | "incomplete";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: String, enum: ["free", "starter", "pro", "team"], required: true },
    status: {
      type: String,
      enum: ["active", "trialing", "canceled", "past_due", "incomplete"],
      required: true
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true }
  },
  { timestamps: true }
);

export const SubscriptionModel = model<SubscriptionDocument>("Subscription", subscriptionSchema);
