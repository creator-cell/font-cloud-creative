import mongoose, { Schema, model, Types, InferSchemaType } from "mongoose";

const guardrailEventSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["hold_insufficient", "negative_balance_attempt"],
      required: true
    },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date(), index: true }
  },
  { timestamps: false }
);

guardrailEventSchema.index({ userId: 1, type: 1, createdAt: -1 });

export type GuardrailEvent = InferSchemaType<typeof guardrailEventSchema>;
export const GuardrailEventModel =
  mongoose.models.GuardrailEvent ||
  model("GuardrailEvent", guardrailEventSchema);
export default GuardrailEventModel;
