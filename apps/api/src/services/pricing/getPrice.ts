import { Types } from "mongoose";
import ProviderPriceModel from "../../models/ProviderPrice";
import type { SupportedCurrency } from "./fx";

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

  throw new Error(`No provider price configured for ${provider}/${model} at ${at.toISOString()}`);
};
