import mongoose, { Schema, model, InferSchemaType, Types } from "mongoose";

const purchaseSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", index: true, required: true },
    planSnapshot: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["completed", "refunded", "canceled"],
      default: "completed",
      index: true
    }
  },
  { timestamps: true }
);

export type Purchase = InferSchemaType<typeof purchaseSchema>;
export const PurchaseModel =
  mongoose.models.Purchase || model("Purchase", purchaseSchema);
export default PurchaseModel;
