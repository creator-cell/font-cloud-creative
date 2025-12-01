// @ts-nocheck
import type { Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../../types/express.js";
import { listAlertsQuerySchema } from "../../schemas/adminAlertSchemas.js";
import {
  acknowledgeSystemAlert,
  listSystemAlerts,
  type SystemAlertLean
} from "../../services/systemAlertService.js";
import { UserModel } from "../../models/index.js";
import { Guardrails } from "../../config/guardrails.js";

const resolveUserEmails = async (userIds: Types.ObjectId[]): Promise<Map<string, string>> => {
  if (userIds.length === 0) return new Map();
  const users = await UserModel.find({ _id: { $in: userIds } })
    .select({ email: 1 })
    .lean<{ _id: Types.ObjectId; email?: string }>()
    .exec();
  const map = new Map<string, string>();
  users.forEach((user) => {
    map.set(user._id.toHexString(), user.email ?? "");
  });
  return map;
};

const formatNumber = (value: unknown, fractionDigits = 0): string => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
};

const buildAlertMessage = (alert: SystemAlertLean): string => {
  const meta = (alert.meta ?? {}) as Record<string, unknown>;
  switch (alert.type) {
    case "spend_spike": {
      const total24h = meta.total24h as number | undefined;
      const avgDaily = meta.avgDaily as number | undefined;
      const deltaPct = meta.deltaPct as number | undefined;
      return `24h spend ${formatNumber(total24h)} tokens vs avg ${formatNumber(avgDaily)} (${formatNumber(
        deltaPct,
        1
      )}% above baseline)`;
    }
    case "insufficient_tokens": {
      const required = meta.required as number | undefined;
      const spendable = meta.spendable as number | undefined;
      const provider = meta.provider as string | undefined;
      const model = meta.model as string | undefined;
      return `Hold insufficient for ${provider ?? "unknown"}/${model ?? "unknown"} — needed ${formatNumber(
        required
      )}, available ${formatNumber(spendable)}`;
    }
    case "negative_balance": {
      const balance = meta.balance as number | undefined;
      return `Wallet balance negative (${formatNumber(balance)} tokens)`;
    }
    case "cap_exceeded": {
      const requested = meta.requestedTokens as number | undefined;
      return `Requested ${formatNumber(
        requested
      )} tokens exceeds cap of ${formatNumber(Guardrails.MAX_TOKENS_PER_TURN)}`;
    }
    default:
      return "Guardrail alert";
  }
};

const serializeAlert = (
  alert: SystemAlertLean,
  emailMap: Map<string, string>
): Record<string, unknown> => {
  const userId = alert.userId ? (alert.userId as Types.ObjectId).toHexString() : undefined;
  return {
    id: alert._id.toHexString(),
    type: alert.type,
    severity: alert.severity,
    userId,
    userEmail: userId ? emailMap.get(userId) ?? "" : "",
    createdAt: alert.createdAt
      ? new Date(alert.createdAt).toISOString()
      : new Date().toISOString(),
    acknowledgedAt: alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toISOString() : undefined,
    status: alert.acknowledgedAt ? "acknowledged" : "new",
    message: buildAlertMessage(alert),
    meta: alert.meta ?? {}
  };
};

export const listAdminSystemAlerts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = listAlertsQuerySchema.parse(req.query);
  const { alerts, pagination } = await listSystemAlerts({
    type: params.type,
    severity: params.severity,
    from: params.from ?? undefined,
    to: params.to ?? undefined,
    page: params.page,
    limit: params.limit
  });

  const userIds = alerts
    .map((alert) => (alert.userId ? (alert.userId as Types.ObjectId) : null))
    .filter((value): value is Types.ObjectId => Boolean(value));

  const emailMap = await resolveUserEmails(userIds);

  res.json({
    alerts: alerts.map((alert) => serializeAlert(alert, emailMap)),
    pagination
  });
});

export const acknowledgeAdminSystemAlert = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const alert = await acknowledgeSystemAlert(id);
    if (!alert) {
      res.status(404).json({ error: "ALERT_NOT_FOUND" });
      return;
    }

    const userId = alert.userId ? (alert.userId as Types.ObjectId).toHexString() : undefined;
    const emailMap =
      userId && alert.userId
        ? await resolveUserEmails([alert.userId as unknown as Types.ObjectId])
        : new Map<string, string>();

    res.json({
      alert: serializeAlert(alert, emailMap)
    });
  }
);
