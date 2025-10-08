import { Schema, model, type Document } from "mongoose";

export interface AnnouncementDocument extends Document {
  title: string;
  body: string;
  audience: "all" | "paid" | "free";
  link?: string;
  createdAt: Date;
  published: boolean;
  publishAt?: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<AnnouncementDocument>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, enum: ["all", "paid", "free"], default: "all" },
    link: { type: String },
    published: { type: Boolean, default: false },
    publishAt: { type: Date }
  },
  { timestamps: true }
);

export const AnnouncementModel = model<AnnouncementDocument>("Announcement", announcementSchema);
