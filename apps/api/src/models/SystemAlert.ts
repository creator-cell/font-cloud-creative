import mongoose, { Schema, Types, model, InferSchemaType } from "mongoose";
import { sendAlertNotifications } from "../services/notifications/alertNotify";

const systemAlertSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: false },
    type: {
      type: String,
      required: true,
      enum: ["spend_spike", "insufficient_tokens", "negative_balance", "cap_exceeded"]
    },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"]
    },
    meta: { type: Schema.Types.Mixed, default: undefined },
    acknowledgedAt: { type: Date },
    createdAt: { type: Date, default: () => new Date() }
  },
  { timestamps: false, collection: "system_alerts" }
);

systemAlertSchema.index({ type: 1, createdAt: -1 });

systemAlertSchema.post("save", async function (doc) {
  if (doc.severity === "high") {
    await sendAlertNotifications(doc);
  }
});

export type SystemAlert = InferSchemaType<typeof systemAlertSchema>;
export type SystemAlertDocument = mongoose.HydratedDocument<SystemAlert>;

export const SystemAlertModel =
  mongoose.models.SystemAlert || model<SystemAlert>("SystemAlert", systemAlertSchema);

export default SystemAlertModel;
