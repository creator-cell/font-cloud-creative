import { Schema, model, type Document, Types } from "mongoose";

export interface SupportMessage {
  senderId: Types.ObjectId;
  body: string;
  createdAt: Date;
}

export interface SupportTicketDocument extends Document {
  userId: Types.ObjectId;
  status: "open" | "pending" | "resolved" | "closed";
  subject: string;
  messages: SupportMessage[];
  priority: "low" | "medium" | "high";
  assigneeId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const supportMessageSchema = new Schema<SupportMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const supportTicketSchema = new Schema<SupportTicketDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "pending", "resolved", "closed"], default: "open" },
    subject: { type: String, required: true },
    messages: { type: [supportMessageSchema], default: [] },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const SupportTicketModel = model<SupportTicketDocument>("SupportTicket", supportTicketSchema);
