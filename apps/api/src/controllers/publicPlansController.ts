import type { Request, Response } from "express";
import { PlanModel } from "../models/Plan";

export const listPublicPlans = async (_req: Request, res: Response) => {
  const now = new Date();

  const plans = await PlanModel.find({
    status: "active",
    "visibility.public": true,
    $and: [
      {
        $or: [{ effectiveFrom: { $exists: false } }, { effectiveFrom: { $lte: now } }]
      },
      {
        $or: [{ effectiveTo: { $exists: false } }, { effectiveTo: { $gte: now } }]
      }
    ]
  })
    .sort({ "visibility.sortOrder": 1 })
    .lean()
    .exec();

  res.json({ plans });
};
