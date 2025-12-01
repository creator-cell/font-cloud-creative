// @ts-nocheck
import type { Response } from "express";
import { Types } from "mongoose";
import TokenTransactionModel from "../models/TokenTransaction.js";
import WalletModel from "../models/Wallet.js";
import type { AuthenticatedRequest } from "../types/express.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rechargeWalletSchema, walletTransactionsQuerySchema } from "../schemas/walletSchemas.js";
import { creditWalletBalance } from "../services/token/walletService.js";

const CREDIT_TYPES = new Set(["grant", "adjustment", "refund"]);
const DEBIT_TYPES = new Set(["spend"]);
const HOLD_TYPES = new Set(["hold", "hold_release"]);

const kindToTypes: Record<string, string[]> = {
  all: [],
  credit: Array.from(CREDIT_TYPES),
  debit: Array.from(DEBIT_TYPES),
  hold: Array.from(HOLD_TYPES)
};

export const listWalletTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { cursor, limit = 25, kind = "all", type, source } = walletTransactionsQuerySchema.parse(req.query);

  let cursorId: Types.ObjectId | undefined;
  if (cursor) {
    if (!Types.ObjectId.isValid(cursor)) {
      res.status(400).json({ error: "Invalid cursor" });
      return;
    }
    cursorId = new Types.ObjectId(cursor);
  }

  const match: Record<string, unknown> = { userId: new Types.ObjectId(req.user.sub) };
  if (cursorId) {
    match._id = { $lt: cursorId };
  }
  if (source) {
    match.source = source;
  }

  if (type) {
    match.type = type;
  } else if (kind && kind !== "all") {
    match.type = { $in: kindToTypes[kind] ?? [] };
  }

  const records = await TokenTransactionModel.find(match)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean()
    .exec();

  const hasNext = records.length > limit;
  const items = records.slice(0, limit);
  const nextCursor = hasNext ? items[items.length - 1]._id.toString() : null;

  const responseItems = items.map((record) => {
    const meta = record.meta && typeof record.meta === "object" ? record.meta : {};
    let direction: "credit" | "debit" | "hold" = "debit";
    if (CREDIT_TYPES.has(record.type)) {
      direction = "credit";
    } else if (HOLD_TYPES.has(record.type)) {
      direction = "hold";
    }

    return {
      id: record._id.toString(),
      type: record.type,
      direction,
      amountTokens: record.amountTokens,
      currency: record.currency ?? null,
      amountFiatCents: record.amountFiatCents ?? null,
      source: record.source ?? null,
      refId: record.refId ?? null,
      provider: record.provider ?? null,
      model: record.model ?? null,
      meta,
      createdAt: record.createdAt?.toISOString?.() ?? new Date().toISOString()
    };
  });

  res.json({
    items: responseItems,
    nextCursor
  });
});

export const rechargeWallet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = rechargeWalletSchema.parse(req.body);
  const userId = new Types.ObjectId(req.user.sub);
  const refId = payload.reference ?? `recharge:${userId.toHexString()}:${Date.now()}`;

  const result = await creditWalletBalance({
    userId,
    amountTokens: payload.tokens,
    source: "recharge",
    refId,
    currency: payload.currency,
    amountFiatCents: payload.amountCents,
    meta: {
      amountCents: payload.amountCents ?? null
    }
  });

  const wallet = await WalletModel.findOne({ userId }).lean().exec();

  res.json({
    credited: result.credited,
    balance: result.balance,
    idempotent: result.idempotent,
    wallet: {
      tokenBalance: wallet?.tokenBalance ?? result.balance,
      holdAmount: wallet?.holdAmount ?? 0,
      creditLimit: wallet?.creditLimit ?? 0,
      currency: wallet?.currency ?? payload.currency
    }
  });
});
