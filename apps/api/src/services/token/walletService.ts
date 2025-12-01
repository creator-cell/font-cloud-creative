import { Types, type ClientSession } from "mongoose";
import WalletModel from "../../models/Wallet.js";
import TokenTransactionModel from "../../models/TokenTransaction.js";
import { withMongoTxn } from "./mongoSession.js";

export type CreditWalletOptions = {
  userId: Types.ObjectId;
  amountTokens: number;
  source: string;
  refId: string;
  currency?: string;
  meta?: Record<string, unknown>;
  amountFiatCents?: number;
  session?: ClientSession;
};

export type CreditWalletResult = {
  credited: number;
  balance: number;
  idempotent: boolean;
};

const runWithSession = async <T>(
  session: ClientSession | undefined,
  operation: (session: ClientSession) => Promise<T>
): Promise<T> => {
  if (session) {
    return operation(session);
  }
  return withMongoTxn(operation);
};

export const creditWalletBalance = async ({
  userId,
  amountTokens,
  source,
  refId,
  currency = "INR",
  meta = {},
  amountFiatCents,
  session
}: CreditWalletOptions): Promise<CreditWalletResult> => {
  if (!amountTokens || amountTokens <= 0) {
    return { credited: 0, balance: 0, idempotent: true };
  }

  return runWithSession(session, async (activeSession) => {
    const existingWallet = await WalletModel.findOne({ userId }).session(activeSession);
    let wallet = existingWallet;

    if (!wallet) {
      const [created] = await WalletModel.create(
        [
          {
            userId,
            tokenBalance: 0,
            holdAmount: 0,
            creditLimit: 0,
            currency
          }
        ],
        { session: activeSession }
      );
      wallet = created;
    }

    const balanceBefore = wallet?.tokenBalance ?? 0;
    const balanceAfter = balanceBefore + amountTokens;

    try {
      await TokenTransactionModel.create(
        [
          {
            userId,
            type: "grant",
            amountTokens,
            source,
            refId,
            currency: wallet?.currency ?? currency,
            amountFiatCents: amountFiatCents ?? 0,
            meta: {
              ...meta,
              balanceBefore,
              balanceAfter
            }
          }
        ],
        { session: activeSession }
      );
    } catch (error: any) {
      const isDuplicate = error?.code === 11000;
      if (!isDuplicate) throw error;
      const current = await WalletModel.findOne({ userId }).session(activeSession);
      return {
        credited: 0,
        balance: current?.tokenBalance ?? balanceBefore,
        idempotent: true
      };
    }

    const updatedWallet = await WalletModel.findOneAndUpdate(
      { userId },
      {
        $inc: { tokenBalance: amountTokens },
        ...(currency ? { $set: { currency } } : {})
      },
      { new: true, session: activeSession }
    );

    return {
      credited: amountTokens,
      balance: updatedWallet?.tokenBalance ?? balanceAfter,
      idempotent: false
    };
  });
};
