import { Types } from "mongoose";
import WalletModel from "../../models/Wallet";
import TokenTransactionModel from "../../models/TokenTransaction";
import { withMongoTxn } from "./mongoSession";
import { CHAT_TOKEN_SOURCE, buildChatTurnRef } from "./estimate";

type CancelChatHoldResult = {
  releasedTokens: number;
  hadHold: boolean;
};

export async function cancelChatHold(userId: Types.ObjectId, turnId: string): Promise<CancelChatHoldResult> {
  const refId = buildChatTurnRef(turnId);

  return withMongoTxn(async (session) => {
    const wallet = await WalletModel.findOne({ userId }).session(session);
    if (!wallet) {
      return { releasedTokens: 0, hadHold: false };
    }

    const holdTxn = await TokenTransactionModel.findOne({
      userId,
      type: "hold",
      source: CHAT_TOKEN_SOURCE,
      refId
    })
      .session(session)
      .lean()
      .exec();

    if (!holdTxn) {
      return { releasedTokens: 0, hadHold: false };
    }

    const balanceBefore = wallet.tokenBalance ?? 0;
    const holdAmountBefore = wallet.holdAmount ?? 0;
    const releaseTokens = Math.min(holdAmountBefore, holdTxn.amountTokens);

    if (releaseTokens > 0) {
      await WalletModel.updateOne(
        { userId },
        { $inc: { holdAmount: -releaseTokens } },
        { session }
      ).exec();
    }

    await TokenTransactionModel.findOneAndUpdate(
      {
        userId,
        type: "hold_release",
        source: CHAT_TOKEN_SOURCE,
        refId
      },
      {
        $set: {
          amountTokens: holdTxn.amountTokens,
          provider: holdTxn.provider,
          model: holdTxn.model,
          currency: wallet.currency,
          meta: {
            releasedTokens: releaseTokens,
            reason: "cancelled",
            balanceBefore,
            balanceAfter: balanceBefore,
            holdAmountBefore,
            holdAmountAfter: Math.max(holdAmountBefore - releaseTokens, 0)
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

    console.info("[chat][hold] hold cancelled", {
      turnId,
      userId: userId.toHexString(),
      releasedTokens: releaseTokens
    });

    return { releasedTokens: releaseTokens, hadHold: true };
  });
}
