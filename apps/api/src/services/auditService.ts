import { Types } from "mongoose";
import { AuditLogModel } from "../models";

interface AuditOptions {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | Types.ObjectId;
  meta?: Record<string, unknown>;
  ip?: string | string[];
  userAgent?: string;
}

export const auditService = {
  async record({ actorId, action, entityType, entityId, meta, ip, userAgent }: AuditOptions) {
    await AuditLogModel.create({
      actorId: new Types.ObjectId(actorId),
      action,
      entityType,
      entityId,
      meta,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent
    });
  }
};
