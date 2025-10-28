import { Types } from "mongoose";
import WalletModel from "../../models/Wallet";
import TokenTransactionModel from "../../models/TokenTransaction";
import TokenUsageModel from "../../models/TokenUsage";
import { withMongoTxn } from "./mongoSession";
import {
  CHAT_TOKEN_SOURCE,
  buildChatTurnRef,
  ensureObjectId,
  summarizeTokens
} from "./estimate";
import { getActivePrice } from "../pricing/getPrice";
import { calcCostCents } from "../pricing/calcCost";
import { convertCents, type SupportedCurrency } from "../pricing/fx";
import { createSystemAlert } from "../systemAlertService";

type SettleChatTurnInput = {
  userId: Types.ObjectId;
  turnId: string;
  provider: string;
  model: string;
  conversationId?: Types.ObjectId;
  chatTurnMongoId?: Types.ObjectId;
  tokensIn: number;
  tokensOut: number;
  finalCostCents?: number;
  latencyMs?: number;
};

type SettleChatTurnResult = {
  holdTokens: number;
  spentTokens: number;
  releasedTokens: number;
  finalCostCents: number;
};

const buildTransactionQuery = (userId: Types.ObjectId, turnId: string, type: string) => ({
  userId,
  type,
  source: CHAT_TOKEN_SOURCE,
  refId: buildChatTurnRef(turnId)
});

export async function settleChatTurn(input: SettleChatTurnInput): Promise<SettleChatTurnResult> {
  const refId = buildChatTurnRef(input.turnId);
  const totalTokens = summarizeTokens(input.tokensIn, input.tokensOut);

  return withMongoTxn(async (session) => {
    const wallet = await WalletModel.findOne({ userId: input.userId }).session(session);
    if (!wallet) {
      throw new Error("WALLET_NOT_FOUND");
    }

    const walletCurrency = (wallet.currency as SupportedCurrency) || "INR";
    const price = await getActivePrice({
      provider: input.provider,
      model: input.model,
      currency: walletCurrency,
      at: new Date()
    });

    const calculatedCost = calcCostCents({
      tokensIn: input.tokensIn,
      tokensOut: input.tokensOut,
      price
    });

    let resolvedFinalCost = input.finalCostCents ?? calculatedCost;
    if (price.currency !== walletCurrency) {
      resolvedFinalCost = convertCents(resolvedFinalCost, price.currency, walletCurrency);
    }

    const holdTxn = await TokenTransactionModel.findOne({
      userId: input.userId,
      type: "hold",
      source: CHAT_TOKEN_SOURCE,
      refId
    })
      .session(session)
      .lean()
      .exec();

    const holdTokens = holdTxn?.amountTokens ?? totalTokens;
    const safeCapExceeded =
      Boolean(
        holdTxn?.meta &&
          typeof holdTxn.meta === "object" &&
          (holdTxn.meta as Record<string, unknown>).safeCapExceeded
      );
    const heldAmount = wallet.holdAmount;
    const releaseTokens = Math.min(holdTokens, heldAmount);

    const resultingBalance = wallet.tokenBalance - totalTokens;

    await WalletModel.updateOne(
      { userId: input.userId },
      {
        $inc: {
          holdAmount: -releaseTokens,
          tokenBalance: -totalTokens
        }
      },
      { session }
    ).exec();

    if (resultingBalance < 0) {
      await createSystemAlert({
        type: "negative_balance",
        severity: "high",
        userId: input.userId,
        meta: {
          turnId: input.turnId,
          provider: input.provider,
          model: input.model,
          balance: resultingBalance
        },
        session
      });
    }

    await TokenTransactionModel.findOneAndUpdate(
      buildTransactionQuery(input.userId, input.turnId, "spend"),
      {
        $set: {
          amountTokens: totalTokens,
          provider: input.provider,
          model: input.model,
          amountFiatCents: resolvedFinalCost,
          currency: wallet.currency,
          meta: {
            tokensIn: input.tokensIn,
            tokensOut: input.tokensOut,
            latencyMs: input.latencyMs ?? 0,
            pricingCurrency: price.currency,
            pricingNeedsFx: price.currency !== walletCurrency,
            priceSourceId: price.sourceId?.toHexString(),
            ...(safeCapExceeded ? { safeCapExceeded: true } : {})
          }
        }
      },
      {
        session,
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).exec();

    await TokenTransactionModel.findOneAndUpdate(
      buildTransactionQuery(input.userId, input.turnId, "hold_release"),
      {
        $set: {
          amountTokens: holdTokens,
          provider: input.provider,
          model: input.model,
          currency: wallet.currency,
          meta: { releasedTokens: releaseTokens }
        }
      },
      {
        session,
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).exec();

    const conversationId = ensureObjectId(input.conversationId);
    const turnMongoId = ensureObjectId(input.chatTurnMongoId);

    await TokenUsageModel.findOneAndUpdate(
      {
        userId: input.userId,
        conversationId,
        turnId: turnMongoId,
        provider: input.provider,
        model: input.model
      },
      {
        $set: {
          userId: input.userId,
          conversationId,
          turnId: turnMongoId,
          provider: input.provider,
          model: input.model,
          tokensIn: input.tokensIn,
          tokensOut: input.tokensOut,
          totalTokens: totalTokens,
          estimatedCostCents: resolvedFinalCost,
          finalCostCents: resolvedFinalCost,
          currency: walletCurrency,
          latencyMs: input.latencyMs ?? 0,
          status: "completed"
        }
      },
      {
        session,
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).exec();

    console.info("[chat][settle] turn completed", {
      turnId: input.turnId,
      userId: input.userId.toHexString(),
      spentTokens: totalTokens,
      holdTokens,
      releasedTokens: releaseTokens,
      finalCostCents: resolvedFinalCost
    });

    return {
      holdTokens,
      releasedTokens: releaseTokens,
      spentTokens: totalTokens,
      finalCostCents: resolvedFinalCost
    };
  });
}
