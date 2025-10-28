import { Types } from "mongoose";
import WalletModel from "../../models/Wallet";
import TokenTransactionModel from "../../models/TokenTransaction";
import { withMongoTxn } from "./mongoSession";

export type PlanSnapshot = {
  key: string;
  name: string;
  billing: { currency: "INR" | "USD" | "SAR" };
  tokens: { included: number };
};

export async function allocateOnRegistration(userId: Types.ObjectId, plan: PlanSnapshot) {
  if (!plan?.tokens?.included || plan.tokens.included <= 0) {
    return { credited: 0, balance: 0, idempotent: false };
  }

  return withMongoTxn(async (session) => {
    await WalletModel.updateOne(
      { userId },
      {
        $setOnInsert: {
          tokenBalance: 0,
          holdAmount: 0,
          creditLimit: 0,
          currency: plan.billing.currency
        }
      },
      { upsert: true, session }
    );

    const refId = `plan:${plan.key}`;

    try {
      await TokenTransactionModel.create(
        [
          {
            userId,
            type: "grant",
            amountTokens: plan.tokens.included,
            source: "registration",
            refId,
            currency: plan.billing.currency,
            meta: { planKey: plan.key, planName: plan.name }
          }
        ],
        { session }
      );
    } catch (error: any) {
      const isDuplicate = error?.code === 11000;
      if (!isDuplicate) {
        throw error;
      }
      const existingWallet = await WalletModel.findOne({ userId }).session(session);
      return { credited: 0, balance: existingWallet?.tokenBalance ?? 0, idempotent: true };
    }

    const updatedWallet = await WalletModel.findOneAndUpdate(
      { userId },
      { $inc: { tokenBalance: plan.tokens.included } },
      { new: true, session }
    );

    return {
      credited: plan.tokens.included,
      balance: updatedWallet?.tokenBalance ?? plan.tokens.included,
      idempotent: false
    };
  });
}
