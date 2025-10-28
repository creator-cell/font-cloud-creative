import { Types } from "mongoose";

export const CHAT_TOKEN_SOURCE = "chat_turn";

export const buildChatTurnRef = (turnId: string): string => `chat:${turnId}`;

export const clampTokens = (value: number): number => Math.max(0, Math.floor(value));

export const estimateHoldTokens = (promptTokens: number, maxOutputTokens: number): number => {
  const prompt = clampTokens(promptTokens);
  const maxOutput = clampTokens(maxOutputTokens);
  const total = prompt + maxOutput;
  return total <= 0 ? 1 : total;
};

export const summarizeTokens = (tokensIn: number, tokensOut: number): number =>
  clampTokens(tokensIn) + clampTokens(tokensOut);

export const ensureObjectId = (value?: Types.ObjectId | string | null): Types.ObjectId | undefined => {
  if (!value) return undefined;
  if (value instanceof Types.ObjectId) return value;
  if (Types.ObjectId.isValid(value)) return new Types.ObjectId(value);
  return undefined;
};
