// @ts-nocheck
import type { Response } from "express";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../../types/express.js";
import { TokenTransactionModel, TokenUsageModel, UserModel, WalletModel } from "../../models/index.js";
import {
  adjustWalletSchema,
  ledgerQuerySchema,
  listWalletsQuerySchema,
  usageQuerySchema
} from "../../schemas/adminFinanceSchemas.js";
import { withMongoTxn } from "../../services/token/mongoSession.js";
import { recordGuardrailEvent } from "../../services/guardrailService.js";
import { convertCents, type SupportedCurrency } from "../../services/pricing/fx.js";

const objectIdOrNull = (value?: string) => {
  if (!value) return null;
  return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;
};

const directionToSort = (direction: "asc" | "desc") => (direction === "asc" ? 1 : -1);

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const stringValue =
    typeof value === "string" ? value : value instanceof Date ? value.toISOString() : String(value);
  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const resolveUserEmails = async (userIds: Types.ObjectId[]): Promise<Map<string, string>> => {
  if (userIds.length === 0) return new Map();
  const users = await UserModel.find({ _id: { $in: userIds } })
    .select({ email: 1 })
    .lean()
    .exec();
  const map = new Map<string, string>();
  users.forEach((user) => {
    map.set(user._id.toHexString(), user.email ?? "");
  });
  return map;
};

export const listAdminWallets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = listWalletsQuerySchema.parse(req.query);
  const match: Record<string, unknown> = {};

  if (params.q) {
    const search = params.q.trim();
    const emailRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const ids: Types.ObjectId[] = [];

    if (Types.ObjectId.isValid(search)) {
      ids.push(new Types.ObjectId(search));
    }

    const userMatches = await UserModel.find({
      $or: [{ email: emailRegex }, ...(ids.length > 0 ? [{ _id: { $in: ids } }] : [])]
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    const matchedIds = userMatches.map((user) => user._id);
    if (matchedIds.length === 0) {
      res.json({ items: [], total: 0, stats: { totalBalance: 0, totalHold: 0, users: 0 } });
      return;
    }
    match.userId = { $in: matchedIds };
  }

  const page = params.page;
  const limit = params.limit;
  const skip = (page - 1) * limit;
  const sortField = params.sort;
  const sort = { [sortField]: directionToSort(params.direction), _id: 1 };

  const [items, total, stats] = await Promise.all([
    WalletModel.find(match)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    WalletModel.countDocuments(match),
    WalletModel.aggregate<{ totalBalance: number; totalHold: number; users: number }>([
      { $match: match },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$tokenBalance" },
          totalHold: { $sum: "$holdAmount" },
          users: { $sum: 1 }
        }
      }
    ])
  ]);

  const userIds = items.map((item) => item.userId as Types.ObjectId);
  const emails = await resolveUserEmails(userIds);
  const statsDoc = stats[0];

  res.json({
    items: items.map((item) => ({
      userId: (item.userId as Types.ObjectId).toHexString(),
      email: emails.get((item.userId as Types.ObjectId).toHexString()) ?? "",
      tokenBalance: item.tokenBalance,
      holdAmount: item.holdAmount,
      creditLimit: item.creditLimit,
      updatedAt: item.updatedAt
    })),
    total,
    stats: statsDoc
      ? {
          totalBalance: statsDoc.totalBalance ?? 0,
          totalHold: statsDoc.totalHold ?? 0,
          users: statsDoc.users ?? 0
        }
      : { totalBalance: 0, totalHold: 0, users: 0 }
  });
});

const buildLedgerMatch = (params: z.infer<typeof ledgerQuerySchema>) => {
  const match: Record<string, unknown> = {};
  const userId = objectIdOrNull(params.userId);
  if (userId) match.userId = userId;
  if (params.type) match.type = params.type;
  if (params.source) match.source = params.source;
  if (params.provider) match.provider = params.provider;
  if (params.model) match.model = params.model;
  if (params.refId) match.refId = params.refId;
  if (params.from || params.to) {
    match.createdAt = {
      ...(params.from ? { $gte: params.from } : {}),
      ...(params.to ? { $lte: params.to } : {})
    };
  }
  return match;
};

type LedgerQueryParams = z.infer<typeof ledgerQuerySchema>;
type UsageQueryParams = z.infer<typeof usageQuerySchema>;

export const listAdminLedger = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = ledgerQuerySchema.parse(req.query);
  const match = buildLedgerMatch(params);
  const page = params.page;
  const limit = params.limit;
  const skip = (page - 1) * limit;

  const sort = { [params.sort]: directionToSort(params.direction), _id: 1 };

  const [records, total] = await Promise.all([
    TokenTransactionModel.find(match)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    TokenTransactionModel.countDocuments(match)
  ]);

  const userIds = records.map((record) => record.userId as Types.ObjectId);
  const emails = await resolveUserEmails(userIds);

  res.json({
    items: records.map((record) => {
      const id = (record._id as Types.ObjectId).toHexString();
      const userId = (record.userId as Types.ObjectId).toHexString();
      return {
        id,
        userId,
        userEmail: emails.get(userId) ?? "",
        type: record.type,
        amountTokens: record.amountTokens,
        source: record.source ?? "",
        provider: record.provider ?? "",
        model: record.model ?? "",
        refId: record.refId ?? "",
        currency: record.currency ?? "",
        amountFiatCents: record.amountFiatCents ?? 0,
        createdAt: record.createdAt,
        meta: record.meta ?? {}
      };
    }),
    total
  });
});

export const listAdminUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = usageQuerySchema.parse(req.query);
  const match: Record<string, unknown> = {};
  const userId = objectIdOrNull(params.userId);
  if (userId) match.userId = userId;
  if (params.provider) match.provider = params.provider;
  if (params.model) match.model = params.model;
  if (params.status) match.status = params.status;
  if (params.from || params.to) {
    match.createdAt = {
      ...(params.from ? { $gte: params.from } : {}),
      ...(params.to ? { $lte: params.to } : {})
    };
  }

  const page = params.page;
  const limit = params.limit;
  const skip = (page - 1) * limit;

  const sort = { [params.sort]: directionToSort(params.direction), _id: 1 };
  const displayCurrency = (params.displayCurrency as SupportedCurrency) ?? "INR";

  const [records, total, aggregates] = await Promise.all([
    TokenUsageModel.find(match)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    TokenUsageModel.countDocuments(match),
    TokenUsageModel.aggregate<{ totalTokens: number; avgLatencyMs: number }>([
      { $match: match },
      {
        $group: {
          _id: null,
          totalTokens: { $sum: "$totalTokens" },
          avgLatencyMs: { $avg: "$latencyMs" }
        }
      }
    ])
  ]);

  const userIds = records.map((record) => record.userId as Types.ObjectId);
  const emails = await resolveUserEmails(userIds);

  let totalCostInDisplay = 0;

  res.json({
    items: records.map((record) => {
      const id = (record._id as Types.ObjectId).toHexString();
      const userId = (record.userId as Types.ObjectId).toHexString();
      const recordCurrency = (record.currency as SupportedCurrency) ?? "INR";
      const finalCostCents = record.finalCostCents ?? 0;
      const costDisplay =
        recordCurrency === displayCurrency
          ? Math.round(finalCostCents)
          : convertCents(finalCostCents, recordCurrency, displayCurrency);

      totalCostInDisplay += costDisplay;

      return {
        id,
        userId,
        userEmail: emails.get(userId) ?? "",
        provider: record.provider ?? "",
        model: record.model ?? "",
        tokensIn: record.tokensIn ?? 0,
        tokensOut: record.tokensOut ?? 0,
        totalTokens: record.totalTokens ?? 0,
        latencyMs: record.latencyMs ?? 0,
        status: record.status ?? "completed",
        finalCostCents,
        currency: recordCurrency,
        displayCostCents: costDisplay,
        createdAt: record.createdAt,
        conversationId: record.conversationId ? record.conversationId.toString() : undefined,
        turnId: record.turnId ? record.turnId.toString() : undefined
      };
    }),
    total,
    aggregates: {
      totalTokens: aggregates[0]?.totalTokens ?? 0,
      avgLatencyMs: aggregates[0]?.avgLatencyMs ?? 0,
      totalCostCents: totalCostInDisplay,
      currency: displayCurrency
    }
  });
});

export const adjustAdminWallet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = adjustWalletSchema.parse(req.body);
  if (!Types.ObjectId.isValid(payload.userId)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const userId = new Types.ObjectId(payload.userId);
  const user = await UserModel.findById(userId).select({ email: 1 }).lean().exec();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let finalBalance = 0;

  try {
    await withMongoTxn(async (session) => {
      let wallet = await WalletModel.findOne({ userId }).session(session);
      if (!wallet) {
        const [created] = await WalletModel.create(
          [
            {
              userId,
              tokenBalance: 0,
              holdAmount: 0,
              creditLimit: 0,
              currency: "INR"
            }
          ],
          { session }
        );
        wallet = created;
      }

      const newBalance = (wallet.tokenBalance ?? 0) + payload.amountTokens;
      if (newBalance < 0) {
        await recordGuardrailEvent(
          "negative_balance_attempt",
          userId,
          {
            amountTokens: payload.amountTokens,
            reason: payload.reason,
            previousBalance: wallet.tokenBalance
          },
          session
        );
        const error = new Error("Adjustment would result in negative balance");
        (error as Error & { status?: number }).status = 400;
        throw error;
      }

      const refId = `adj:${randomUUID()}`;
      await TokenTransactionModel.create(
        [
          {
            userId,
            type: "adjustment",
            amountTokens: payload.amountTokens,
            source: "admin",
            refId,
            currency: wallet.currency,
            meta: {
              reason: payload.reason,
              actor: req.impersonatorId ?? req.user?.sub ?? "system"
            }
          }
        ],
        { session }
      );

      await WalletModel.updateOne(
        { userId },
        { $inc: { tokenBalance: payload.amountTokens } },
        { session }
      );

      finalBalance = newBalance;
    });
  } catch (error) {
    if ((error as Error & { status?: number }).status === 400) {
      res.status(400).json({ error: (error as Error).message });
      return;
    }
    throw error;
  }

  res.status(200).json({ balance: finalBalance });
});

const streamLedgerRecords = async (
  res: Response,
  params: LedgerQueryParams
): Promise<void> => {
  const match = buildLedgerMatch(params);
  const sort = { [params.sort]: directionToSort(params.direction), _id: 1 };
  const cursor = TokenTransactionModel.find(match).sort(sort).cursor();
  const userCache = new Map<string, string>();

  res.write(
    "createdAt,userEmail,type,amountTokens,currency,amountFiatCents,source,refId,provider,model\n"
  );

  for await (const doc of cursor) {
    const userKey = doc.userId.toHexString();
    let email = userCache.get(userKey);
    if (!email) {
      const user = await UserModel.findById(doc.userId).select({ email: 1 }).lean();
      email = user?.email ?? "";
      userCache.set(userKey, email);
    }

    const row = [
      escapeCsvValue(doc.createdAt?.toISOString() ?? ""),
      escapeCsvValue(email),
      escapeCsvValue(doc.type),
      escapeCsvValue(doc.amountTokens),
      escapeCsvValue(doc.currency ?? ""),
      escapeCsvValue(doc.amountFiatCents ?? 0),
      escapeCsvValue(doc.source ?? ""),
      escapeCsvValue(doc.refId ?? ""),
      escapeCsvValue(doc.provider ?? ""),
      escapeCsvValue(doc.model ?? "")
    ].join(",");
    res.write(`${row}\n`);
  }
};

const streamUsageRecords = async (
  res: Response,
  params: UsageQueryParams
): Promise<void> => {
  const match: Record<string, unknown> = {};
  const userId = objectIdOrNull(params.userId);
  if (userId) match.userId = userId;
  if (params.provider) match.provider = params.provider;
  if (params.model) match.model = params.model;
  if (params.status) match.status = params.status;
  if (params.from || params.to) {
    match.createdAt = {
      ...(params.from ? { $gte: params.from } : {}),
      ...(params.to ? { $lte: params.to } : {})
    };
  }

  const sort = { [params.sort]: directionToSort(params.direction), _id: 1 };
  const cursor = TokenUsageModel.find(match).sort(sort).cursor();
  const userCache = new Map<string, string>();

  res.write(
    "createdAt,userEmail,provider,model,tokensIn,tokensOut,totalTokens,latencyMs,status,conversationId,turnId\n"
  );

  for await (const doc of cursor) {
    const userKey = doc.userId.toHexString();
    let email = userCache.get(userKey);
    if (!email) {
      const user = await UserModel.findById(doc.userId).select({ email: 1 }).lean();
      email = user?.email ?? "";
      userCache.set(userKey, email);
    }

    const row = [
      escapeCsvValue(doc.createdAt?.toISOString() ?? ""),
      escapeCsvValue(email),
      escapeCsvValue(doc.provider ?? ""),
      escapeCsvValue(doc.model ?? ""),
      escapeCsvValue(doc.tokensIn ?? 0),
      escapeCsvValue(doc.tokensOut ?? 0),
      escapeCsvValue(doc.totalTokens ?? 0),
      escapeCsvValue(doc.latencyMs ?? 0),
      escapeCsvValue(doc.status ?? ""),
      escapeCsvValue(doc.conversationId ? doc.conversationId.toString() : ""),
      escapeCsvValue(doc.turnId ? doc.turnId.toString() : "")
    ].join(",");
    res.write(`${row}\n`);
  }
};

export const exportAdminLedgerCsv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = ledgerQuerySchema.parse(req.query);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="ledger-${new Date().toISOString()}.csv"`
  );
  await streamLedgerRecords(res, params);
  res.end();
});

export const exportAdminUsageCsv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = usageQuerySchema.parse(req.query);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="usage-${new Date().toISOString()}.csv"`
  );
  await streamUsageRecords(res, params);
  res.end();
});
