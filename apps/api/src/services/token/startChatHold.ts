// @ts-nocheck
import { Types } from "mongoose";
import WalletModel from "../../models/Wallet.js";
import TokenTransactionModel from "../../models/TokenTransaction.js";
import { withMongoTxn } from "./mongoSession.js";
import { CHAT_TOKEN_SOURCE, buildChatTurnRef, estimateHoldTokens } from "./estimate.js";
import { recordGuardrailEvent } from "../guardrailService.js";
import { Guardrails } from "../../config/guardrails.js";
import { createSystemAlert } from "../systemAlertService.js";

type StartChatHoldInput = {
  userId: Types.ObjectId;
  turnId: string;
  provider: string;
  model: string;
  promptTokens: number;
  maxOutputTokens: number;
};

type StartChatHoldResult = {
  holdTokens: number;
  walletBalance: number;
  holdAmount: number;
};

export class TokenHoldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenHoldError";
  }
}

const INSUFFICIENT_TOKENS_MESSAGE = "INSUFFICIENT_TOKENS_FOR_HOLD";

type HoldOutcome = StartChatHoldResult | { error: string };

export async function startChatHold(input: StartChatHoldInput): Promise<StartChatHoldResult> {
  const refId = buildChatTurnRef(input.turnId);
  const requestedTokens = input.promptTokens + input.maxOutputTokens;
  const safeCapExceeded = requestedTokens > Guardrails.MAX_TOKENS_PER_TURN;
  if (safeCapExceeded) {
    console.warn("[chat][hold] turn exceeds safety cap", {
      userId: input.userId.toHexString(),
      turnId: input.turnId,
      totalRequestedTokens: requestedTokens,
      promptTokens: input.promptTokens,
      maxOutputTokens: input.maxOutputTokens
    });
  }
  const holdTokens = estimateHoldTokens(input.promptTokens, input.maxOutputTokens);

  const capAlertMeta = {
    turnId: input.turnId,
    provider: input.provider,
    model: input.model,
    requestedTokens,
    promptTokens: input.promptTokens,
    maxOutputTokens: input.maxOutputTokens
  };

  const result = await withMongoTxn<HoldOutcome>(async (session) => {
    let capAlertRaised = false;
    const ensureCapAlert = async () => {
      if (!safeCapExceeded || capAlertRaised) {
        return;
      }
      await createSystemAlert({
        type: "cap_exceeded",
        severity: "medium",
        userId: input.userId,
        meta: capAlertMeta,
        session
      });
      capAlertRaised = true;
    };

    const wallet = await WalletModel.findOne({ userId: input.userId }).session(session);
    if (!wallet) {
      throw new TokenHoldError("WALLET_NOT_FOUND");
    }

    const spendableRaw = wallet.tokenBalance + wallet.creditLimit - wallet.holdAmount;
    const spendableTokens = Math.floor(spendableRaw);
    if (spendableTokens <= 0) {
      await ensureCapAlert();
      await recordGuardrailEvent(
        "hold_insufficient",
        input.userId,
        {
          turnId: input.turnId,
          provider: input.provider,
          model: input.model,
          promptTokens: input.promptTokens,
          maxOutputTokens: input.maxOutputTokens,
          spendable: spendableRaw,
          required: holdTokens
        },
        session
      );

      await createSystemAlert({
        type: "insufficient_tokens",
        severity: "low",
        userId: input.userId,
        meta: {
          turnId: input.turnId,
          provider: input.provider,
          model: input.model,
          spendable: spendableRaw,
          required: holdTokens
        },
        session
      });

      return { error: INSUFFICIENT_TOKENS_MESSAGE };
    }

    const effectiveHoldTokens = Math.max(1, Math.min(holdTokens, spendableTokens));
    const partialHold = effectiveHoldTokens < holdTokens;

    const existingHold = await TokenTransactionModel.findOne({
      userId: input.userId,
      type: "hold",
      source: CHAT_TOKEN_SOURCE,
      refId
    })
      .session(session)
      .lean()
      .exec();

    if (existingHold) {
      if (
        safeCapExceeded &&
        !(
          existingHold.meta &&
          typeof existingHold.meta === "object" &&
          (existingHold.meta as Record<string, unknown>).safeCapExceeded
        )
      ) {
        await TokenTransactionModel.updateOne(
          { _id: existingHold._id },
          { $set: { "meta.safeCapExceeded": true } },
          { session }
        ).exec();

        await ensureCapAlert();
      }

      return {
        holdTokens: existingHold.amountTokens,
        walletBalance: wallet.tokenBalance,
        holdAmount: wallet.holdAmount
      };
    }

    const balanceBefore = wallet.tokenBalance;
    const holdAmountBefore = wallet.holdAmount;

    await WalletModel.updateOne(
      { userId: input.userId },
      { $inc: { holdAmount: effectiveHoldTokens } },
      { session }
    ).exec();

    const holdMeta: Record<string, unknown> = {
      promptTokens: input.promptTokens,
      maxOutputTokens: input.maxOutputTokens,
      balanceBefore,
      balanceAfter: balanceBefore,
      holdAmountBefore,
      holdAmountAfter: holdAmountBefore + effectiveHoldTokens
    };
    if (safeCapExceeded) {
      holdMeta.safeCapExceeded = true;
    }
    if (partialHold) {
      holdMeta.partialHold = true;
      holdMeta.requestedHoldTokens = holdTokens;
      holdMeta.appliedHoldTokens = effectiveHoldTokens;
    }

    await TokenTransactionModel.create(
      [
        {
          userId: input.userId,
          type: "hold",
          amountTokens: effectiveHoldTokens,
          source: CHAT_TOKEN_SOURCE,
          refId,
          provider: input.provider,
          model: input.model,
          meta: holdMeta
        }
      ],
      { session }
    );

    if (safeCapExceeded) {
      await ensureCapAlert();
    }

    console.info("[chat][hold] hold placed", {
      turnId: input.turnId,
      userId: input.userId.toHexString(),
      holdTokens: effectiveHoldTokens,
      requestedHoldTokens: holdTokens,
      spendable: spendableTokens
    });

    return {
      holdTokens: effectiveHoldTokens,
      walletBalance: wallet.tokenBalance,
      holdAmount: wallet.holdAmount + effectiveHoldTokens
    };
  });

  if ("error" in result) {
    throw new TokenHoldError(result.error);
  }

  return result;
}

export const isInsufficientHoldError = (error: unknown): boolean =>
  error instanceof TokenHoldError && error.message === INSUFFICIENT_TOKENS_MESSAGE;
