export const Guardrails = {
  MAX_TOKENS_PER_TURN: 100000,
  MAX_DAILY_SPEND_MULTIPLIER: 3,
  ALERT_EMAIL: process.env.ALERT_EMAIL,
  ALERT_SLACK_WEBHOOK: process.env.ALERT_SLACK_WEBHOOK
} as const;

export type GuardrailType = typeof Guardrails;
