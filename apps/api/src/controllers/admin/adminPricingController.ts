// @ts-nocheck
import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthenticatedRequest } from "../../types/express.js";
import { ProviderPriceModel } from "../../models/index.js";
import {
  createPricingSchema,
  listPricingQuerySchema,
  updatePricingSchema
} from "../../schemas/adminPricingSchemas.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const directionToSort = (direction: "asc" | "desc") => (direction === "asc" ? 1 : -1);
const FAR_FUTURE = new Date("9999-12-31T00:00:00.000Z");

const assertNoOverlap = async (
  {
    provider,
    model,
    currency,
    effectiveFrom,
    effectiveTo
  }: {
    provider: string;
    model: string;
    currency: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
  },
  excludeId?: Types.ObjectId
): Promise<void> => {
  const overlap = await ProviderPriceModel.findOne({
    provider,
    model,
    currency,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    effectiveFrom: { $lt: effectiveTo ?? FAR_FUTURE },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $exists: false } },
      { effectiveTo: { $gt: effectiveFrom } }
    ]
  })
    .lean()
    .exec();

  if (overlap) {
    throw Object.assign(
      new Error("Overlapping pricing window detected for this provider/model/currency"),
      { status: 400 }
    );
  }
};

export const listProviderPricing = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = listPricingQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (params.provider) filter.provider = params.provider;
  if (params.model) filter.model = params.model;
  if (params.currency) filter.currency = params.currency;

  const skip = (params.page - 1) * params.limit;
  const sort = { [params.sort]: directionToSort(params.direction), _id: directionToSort(params.direction) };

  const [items, total] = await Promise.all([
    ProviderPriceModel.find(filter).sort(sort).skip(skip).limit(params.limit).lean().exec(),
    ProviderPriceModel.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page: params.page,
    limit: params.limit
  });
});

export const createProviderPricing = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payload = createPricingSchema.parse(req.body);
  const effectiveFrom = payload.effectiveFrom ?? new Date();
  const effectiveTo = payload.effectiveTo;

  await assertNoOverlap({
    provider: payload.provider,
    model: payload.model,
    currency: payload.currency,
    effectiveFrom,
    effectiveTo
  });

  const price = await ProviderPriceModel.create({
    ...payload,
    effectiveFrom,
    effectiveTo
  });

  res.status(201).json({ price });
});

export const updateProviderPricing = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid pricing id" });
    return;
  }
  const updates = updatePricingSchema.parse(req.body);
  const price = await ProviderPriceModel.findById(id);
  if (!price) {
    res.status(404).json({ error: "Pricing entry not found" });
    return;
  }

  if (updates.effectiveFrom || updates.effectiveTo || updates.inputPer1kCents || updates.outputPer1kCents) {
    const effectiveFrom = updates.effectiveFrom ?? price.effectiveFrom;
    const effectiveTo = updates.effectiveTo ?? price.effectiveTo ?? undefined;
    await assertNoOverlap(
      {
        provider: price.provider,
        model: price.model,
        currency: price.currency,
        effectiveFrom,
        effectiveTo
      },
      price._id
    );
  }

  Object.assign(price, updates);
  await price.save();

  res.json({ price });
});

export const retireProviderPricing = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid pricing id" });
    return;
  }

  const price = await ProviderPriceModel.findById(id);
  if (!price) {
    res.status(404).json({ error: "Pricing entry not found" });
    return;
  }

  if (price.effectiveTo && price.effectiveTo <= new Date()) {
    res.json({ price });
    return;
  }

  price.effectiveTo = new Date();
  await price.save();

  res.json({ price });
});
