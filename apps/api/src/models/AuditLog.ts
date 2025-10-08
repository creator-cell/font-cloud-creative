import { Schema, model, type Document, Types } from "mongoose";

export interface AuditLogDocument extends Document {
  actorId: Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: Types.ObjectId | string;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.Mixed },
    meta: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ actorId: 1, createdAt: -1 });

auditLogSchema.pre("save", function (next) {
  if (this.meta && typeof this.meta === "object") {
    const meta = { ...this.meta } as Record<string, unknown>;
    if (typeof meta.email === "string") {
      const [local, domain] = meta.email.split("@");
      meta.email = `${local?.[0] ?? "*"}***@${domain ?? "***"}`;
    }
    this.meta = meta;
  }
  next();
});

export const AuditLogModel = model<AuditLogDocument>("AuditLog", auditLogSchema);
