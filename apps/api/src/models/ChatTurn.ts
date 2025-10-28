import mongoose, { Schema, model, Types, InferSchemaType } from "mongoose";

const chatTurnSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    conversationId: { type: Types.ObjectId },
    turnId: { type: String, required: true, unique: true, index: true },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    system: { type: String },
    userMessage: { type: String, required: true },
    promptTokens: { type: Number, default: 0 },
    maxOutputTokens: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running"
    },
    startedAt: { type: Date, default: () => new Date() },
    finishedAt: { type: Date },
    usage: {
      tokensIn: { type: Number, default: 0 },
      tokensOut: { type: Number, default: 0 },
      latencyMs: { type: Number, default: 0 },
      error: { type: String }
    }
  },
  { timestamps: true }
);

chatTurnSchema.index({ userId: 1, createdAt: -1 });

export type ChatTurn = InferSchemaType<typeof chatTurnSchema>;
export const ChatTurnModel =
  mongoose.models.ChatTurn || model("ChatTurn", chatTurnSchema);
export default ChatTurnModel;
