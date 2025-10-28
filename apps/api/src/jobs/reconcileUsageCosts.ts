import "../config/env";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database";
import TokenUsageModel from "../models/TokenUsage";
import WalletModel from "../models/Wallet";
import { getActivePrice } from "../services/pricing/getPrice";
import { calcCostCents } from "../services/pricing/calcCost";
import { convertCents, type SupportedCurrency } from "../services/pricing/fx";

type CliOptions = {
  from?: Date;
  to?: Date;
  provider?: string;
  model?: string;
  missingOnly: boolean;
};

const parseArgs = (): CliOptions => {
  const options: CliOptions = { missingOnly: true };
  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split("=");
    switch (key) {
      case "--from":
        if (value) options.from = new Date(value);
        break;
      case "--to":
        if (value) options.to = new Date(value);
        break;
      case "--provider":
        if (value) options.provider = value;
        break;
      case "--model":
        if (value) options.model = value;
        break;
      case "--missing-only":
        options.missingOnly = value === undefined ? true : value !== "false";
        break;
      default:
        break;
    }
  });
  return options;
};

const buildQuery = (options: CliOptions) => {
  const query: mongoose.FilterQuery<typeof TokenUsageModel> = {};
  if (options.provider) query.provider = options.provider;
  if (options.model) query.model = options.model;
  if (options.from || options.to) {
    query.createdAt = {
      ...(options.from ? { $gte: options.from } : {}),
      ...(options.to ? { $lte: options.to } : {})
    };
  }
  if (options.missingOnly) {
    query.$or = [{ finalCostCents: { $exists: false } }, { finalCostCents: { $lte: 0 } }];
  }
  return query;
};

const run = async () => {
  const options = parseArgs();
  await connectDatabase();

  const query = buildQuery(options);
  const cursor = TokenUsageModel.find(query).cursor();

  let processed = 0;
  let updated = 0;
  let totalCost = 0;

  for await (const usage of cursor) {
    processed += 1;
    const wallet = await WalletModel.findOne({ userId: usage.userId }).lean().exec();
    const walletCurrency = (wallet?.currency as SupportedCurrency) || "INR";
    if (!usage.provider || !usage.model) {
      continue;
    }

    const price = await getActivePrice({
      provider: usage.provider,
      model: usage.model,
      currency: walletCurrency,
      at: usage.createdAt ?? new Date()
    });

    const calculated = calcCostCents({
      tokensIn: usage.tokensIn ?? 0,
      tokensOut: usage.tokensOut ?? 0,
      price
    });

    const finalCost =
      price.currency === walletCurrency
        ? calculated
        : convertCents(calculated, price.currency, walletCurrency);

    const needsUpdate =
      usage.finalCostCents !== finalCost ||
      !usage.currency ||
      usage.currency !== walletCurrency;

    if (needsUpdate) {
      usage.finalCostCents = finalCost;
      usage.estimatedCostCents = finalCost;
      usage.currency = walletCurrency;
      await usage.save();
      updated += 1;
    }

    totalCost += finalCost;
  }

  await disconnectDatabase();

  console.info(
    JSON.stringify(
      {
        processed,
        updated,
        totalCostCents: totalCost,
        options
      },
      null,
      2
    )
  );
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Reconcile job failed", error);
    disconnectDatabase().finally(() => process.exit(1));
  });
