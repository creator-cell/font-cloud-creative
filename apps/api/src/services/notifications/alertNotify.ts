import type { SystemAlertDocument } from "../../models/SystemAlert";
import { Guardrails } from "../../config/guardrails";

const formatAlertSummary = (alert: SystemAlertDocument): string => {
  const user = alert.userId ? `User ${alert.userId.toString()}` : "Unscoped user";
  return `${alert.type} (${alert.severity}) detected for ${user}`;
};

const sendEmail = async (alert: SystemAlertDocument): Promise<void> => {
  if (!Guardrails.ALERT_EMAIL) return;
  try {
    console.info("[alerts][notify] email alert", {
      to: Guardrails.ALERT_EMAIL,
      summary: formatAlertSummary(alert),
      id: alert._id?.toString()
    });
    // Integrate with transactional email provider here.
  } catch (error) {
    console.error("[alerts][notify] email send failed", error);
  }
};

const sendSlack = async (alert: SystemAlertDocument): Promise<void> => {
  if (!Guardrails.ALERT_SLACK_WEBHOOK) return;
  try {
    await fetch(Guardrails.ALERT_SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:rotating_light: *${alert.type.toUpperCase()}* (${alert.severity})\n` +
          `${formatAlertSummary(alert)}\n` +
          `Created: ${alert.createdAt?.toISOString() ?? new Date().toISOString()}`
      })
    });
  } catch (error) {
    console.error("[alerts][notify] slack send failed", error);
  }
};

export async function sendAlertNotifications(alert: SystemAlertDocument): Promise<void> {
  if (alert.severity !== "high") return;
  await Promise.allSettled([sendEmail(alert), sendSlack(alert)]);
}
