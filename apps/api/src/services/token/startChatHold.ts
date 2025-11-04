import { Types } from "mongoose";
import WalletModel from "../../models/Wallet";
import TokenTransactionModel from "../../models/TokenTransaction";
import { withMongoTxn } from "./mongoSession";
import { CHAT_TOKEN_SOURCE, buildChatTurnRef, estimateHoldTokens } from "./estimate";
import { recordGuardrailEvent } from "../guardrailService";
import { Guardrails } from "../../config/guardrails";
import { createSystemAlert } from "../systemAlertService";

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

    const spendable = wallet.tokenBalance + wallet.creditLimit - wallet.holdAmount;
    if (spendable < holdTokens) {
      await ensureCapAlert();
      await recordGuardrailEvent("hold_insufficient", input.userId, {
        turnId: input.turnId,
        provider: input.provider,
        model: input.model,
        promptTokens: input.promptTokens,
        maxOutputTokens: input.maxOutputTokens,
        spendable,
        required: holdTokens
      }, session);

      await createSystemAlert({
        type: "insufficient_tokens",
        severity: "low",
        userId: input.userId,
        meta: {
          turnId: input.turnId,
          provider: input.provider,
          model: input.model,
          spendable,
          required: holdTokens
        },
        session
      });

      return { error: INSUFFICIENT_TOKENS_MESSAGE };
    }

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
      { $inc: { holdAmount: holdTokens } },
      { session }
    ).exec();

    const holdMeta: Record<string, unknown> = {
      promptTokens: input.promptTokens,
      maxOutputTokens: input.maxOutputTokens,
      balanceBefore,
      balanceAfter: balanceBefore,
      holdAmountBefore,
      holdAmountAfter: holdAmountBefore + holdTokens
    };
    if (safeCapExceeded) {
      holdMeta.safeCapExceeded = true;
    }

    await TokenTransactionModel.create(
      [
        {
          userId: input.userId,
          type: "hold",
          amountTokens: holdTokens,
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
      holdTokens
    });

    return {
      holdTokens,
      walletBalance: wallet.tokenBalance,
      holdAmount: wallet.holdAmount + holdTokens
    };
  });

  if ("error" in result) {
    throw new TokenHoldError(result.error);
  }

  return result;
}

export const isInsufficientHoldError = (error: unknown): boolean =>
  error instanceof TokenHoldError && error.message === INSUFFICIENT_TOKENS_MESSAGE;
