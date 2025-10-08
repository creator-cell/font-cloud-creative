import type { PlanTier } from "../constants/plans";

type SafetyResult = {
  warnings: string[];
  blocked: boolean;
};

const BLOCKED_KEYWORDS = ["free money", "guaranteed results", "curse"];
const PROFANITY = ["damn", "hell"];

const containsAny = (text: string, list: string[]): string | null => {
  const lower = text.toLowerCase();
  return list.find((item) => lower.includes(item)) ?? null;
};

const walkContent = (value: unknown, collector: string[]): void => {
  if (typeof value === "string") {
    collector.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => walkContent(item, collector));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => walkContent(item, collector));
  }
};

export const runSafetyChecks = (
  payload: Record<string, unknown>,
  taboo: string[],
  plan: PlanTier
): SafetyResult => {
  const messages: string[] = [];
  const strings: string[] = [];
  walkContent(payload, strings);

  for (const text of strings) {
    const blocked = containsAny(text, BLOCKED_KEYWORDS);
    if (blocked) {
      messages.push(`Contains blocked claim: ${blocked}`);
    }
    const profanity = containsAny(text, PROFANITY);
    if (profanity) {
      messages.push(`Contains profanity: ${profanity}`);
    }
    const tabooHit = containsAny(text, taboo.map((item) => item.toLowerCase()));
    if (tabooHit) {
      messages.push(`Violates brand taboo: ${tabooHit}`);
    }
  }

  const blocked = messages.length > 0 && plan === "free";
  return {
    warnings: messages,
    blocked
  };
};
