import type { ClientSession } from "mongoose";
import { Types } from "mongoose";
import GuardrailEventModel from "../models/GuardrailEvent.js";

export type GuardrailEventType = "hold_insufficient" | "negative_balance_attempt";

export const recordGuardrailEvent = async (
  type: GuardrailEventType,
  userId: Types.ObjectId,
  meta: Record<string, unknown> = {},
  session?: ClientSession
): Promise<void> => {
  await GuardrailEventModel.create(
    [
      {
        type,
        userId,
        meta,
        createdAt: new Date()
      }
    ],
    session ? { session } : undefined
  );
};
