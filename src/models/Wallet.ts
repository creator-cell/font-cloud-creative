import mongoose, { InferSchemaType, Schema, model, Types } from "mongoose";

const walletSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    tokenBalance: { type: Number, default: 0 },
    holdAmount: { type: Number, default: 0 },
    creditLimit: { type: Number, default: 0 },
    currency: { type: String, default: "INR" }
  },
  { timestamps: true }
);

export type Wallet = InferSchemaType<typeof walletSchema>;
export const WalletModel =
  mongoose.models.Wallet || model("Wallet", walletSchema);
export default WalletModel;
