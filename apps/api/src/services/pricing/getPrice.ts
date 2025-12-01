// @ts-nocheck
import { Types } from "mongoose";
import ProviderPriceModel from "../../models/ProviderPrice.js";
import type { SupportedCurrency } from "./fx.js";

type GetPriceInput = {
  provider: string;
  model: string;
  currency: SupportedCurrency;
  at?: Date;
};

type PriceResult = {
  inputPer1kCents: number;
  outputPer1kCents: number;
  currency: SupportedCurrency;
  needsFx?: boolean;
  sourceId?: Types.ObjectId;
};

const DEFAULT_CURRENCY: SupportedCurrency = "USD";

const buildWindowQuery = (at: Date) => ({
  effectiveFrom: { $lte: at },
  $or: [{ effectiveTo: null }, { effectiveTo: { $exists: false } }, { effectiveTo: { $gt: at } }]
});

type DefaultPrice = {
  inputPer1kCents: number;
  outputPer1kCents: number;
  currency: SupportedCurrency;
};

const DEFAULT_PRICE_BOOK: Record<string, DefaultPrice> = {
  "openai:gpt-4.1-mini": { inputPer1kCents: 15, outputPer1kCents: 60, currency: "USD" },
  "gpt-4.1-mini": { inputPer1kCents: 15, outputPer1kCents: 60, currency: "USD" },
  "openai:gpt-4o": { inputPer1kCents: 75, outputPer1kCents: 225, currency: "USD" },
  "gpt-4o": { inputPer1kCents: 75, outputPer1kCents: 225, currency: "USD" },
  "openai:gpt-4-turbo": { inputPer1kCents: 30, outputPer1kCents: 60, currency: "USD" },
  "gpt-4-turbo": { inputPer1kCents: 30, outputPer1kCents: 60, currency: "USD" },
  "anthropic:claude-3-5-sonnet": { inputPer1kCents: 150, outputPer1kCents: 150, currency: "USD" },
  "claude-3-5-sonnet": { inputPer1kCents: 150, outputPer1kCents: 150, currency: "USD" },
  "google:gemini-1.5-pro": { inputPer1kCents: 100, outputPer1kCents: 100, currency: "USD" },
  "gemini-1.5-pro": { inputPer1kCents: 100, outputPer1kCents: 100, currency: "USD" },
  "ollama:llama3-8b": { inputPer1kCents: 0, outputPer1kCents: 0, currency: "USD" },
  "llama3-8b": { inputPer1kCents: 0, outputPer1kCents: 0, currency: "USD" },
  "allam:34b": { inputPer1kCents: 50, outputPer1kCents: 50, currency: "USD" },
  "34b": { inputPer1kCents: 50, outputPer1kCents: 50, currency: "USD" }
};

export const getActivePrice = async ({
  provider,
  model,
  currency,
  at = new Date()
}: GetPriceInput): Promise<PriceResult> => {
  const primary = await ProviderPriceModel.findOne({
    provider,
    model,
    currency,
    ...buildWindowQuery(at)
  })
    .sort({ effectiveFrom: -1 })
    .lean();

  if (primary) {
    return {
      inputPer1kCents: primary.inputPer1kCents,
      outputPer1kCents: primary.outputPer1kCents,
      currency: primary.currency as SupportedCurrency,
      sourceId: primary._id
    };
  }

  if (currency !== DEFAULT_CURRENCY) {
    const fallback = await ProviderPriceModel.findOne({
      provider,
      model,
      currency: DEFAULT_CURRENCY,
      ...buildWindowQuery(at)
    })
      .sort({ effectiveFrom: -1 })
      .lean();

    if (fallback) {
      return {
        inputPer1kCents: fallback.inputPer1kCents,
        outputPer1kCents: fallback.outputPer1kCents,
        currency: fallback.currency as SupportedCurrency,
        needsFx: true,
        sourceId: fallback._id
      };
    }
  }

  const defaultCandidates = [model];
  if (!model.includes(":")) {
    defaultCandidates.push(`${provider}:${model}`);
  }

  for (const key of defaultCandidates) {
    const defaultPrice = DEFAULT_PRICE_BOOK[key];
    if (!defaultPrice) continue;

    return {
      inputPer1kCents: defaultPrice.inputPer1kCents,
      outputPer1kCents: defaultPrice.outputPer1kCents,
      currency: defaultPrice.currency,
      needsFx: defaultPrice.currency !== currency
    };
  }

  throw new Error(`No provider price configured for ${provider}/${model} at ${at.toISOString()}`);
};
