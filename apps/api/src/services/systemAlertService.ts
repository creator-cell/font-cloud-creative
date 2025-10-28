import type { ClientSession } from "mongoose";
import { Types } from "mongoose";
import SystemAlertModel, {
  type SystemAlert,
  type SystemAlertDocument
} from "../models/SystemAlert";

export type SystemAlertType = SystemAlert["type"];
export type SystemAlertSeverity = SystemAlert["severity"];
export type SystemAlertLean = SystemAlert & { _id: Types.ObjectId };

type CreateAlertInput = {
  type: SystemAlertType;
  severity: SystemAlertSeverity;
  userId?: Types.ObjectId;
  meta?: Record<string, unknown>;
  session?: ClientSession;
};

export async function createSystemAlert({
  type,
  severity,
  userId,
  meta,
  session
}: CreateAlertInput): Promise<SystemAlertDocument> {
  const [alert] = await SystemAlertModel.create(
    [
      {
        type,
        severity,
        userId,
        meta,
        createdAt: new Date()
      }
    ],
    session ? { session } : undefined
  );
  return alert;
}

type ListAlertsFilters = {
  type?: SystemAlertType;
  severity?: SystemAlertSeverity;
  from?: Date;
  to?: Date;
  page?: number;
  limit?: number;
};

export async function listSystemAlerts({
  type,
  severity,
  from,
  to,
  page = 1,
  limit = 20
}: ListAlertsFilters) {
  const query: Record<string, unknown> = {};
  if (type) query.type = type;
  if (severity) query.severity = severity;
  if (from || to) {
    query.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {})
    };
  }

  const skip = Math.max(page - 1, 0) * limit;

  const [alerts, total] = await Promise.all([
    SystemAlertModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<SystemAlertLean>()
      .exec(),
    SystemAlertModel.countDocuments(query)
  ]);

  return {
    alerts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1
    }
  };
}

export async function acknowledgeSystemAlert(alertId: string): Promise<SystemAlertLean | null> {
  if (!Types.ObjectId.isValid(alertId)) {
    return null;
  }
  return SystemAlertModel.findByIdAndUpdate(
    alertId,
    { $set: { acknowledgedAt: new Date() } },
    { new: true }
  )
    .lean<SystemAlertLean>()
    .exec();
}
