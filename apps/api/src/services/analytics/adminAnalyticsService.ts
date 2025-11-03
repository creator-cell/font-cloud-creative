import { differenceInCalendarWeeks, addDays, addWeeks, addMonths, startOfDay } from "date-fns";
import { Types } from "mongoose";
import TokenUsageModel from "../../models/TokenUsage";
import { UserModel } from "../../models";
import { convertCents, type SupportedCurrency } from "../pricing/fx";
import { redis } from "../../config/redis";

type IntervalUnit = "day" | "week" | "month";

type SummaryParams = {
  from: Date;
  to: Date;
  timezone?: string;
};

type TimeseriesParams = SummaryParams & {
  interval: IntervalUnit;
};

type TopParams = SummaryParams & {
  limit: number;
};

type DistributionParams = SummaryParams;

type CohortParams = {
  start: Date;
  weeks: number;
};

const CACHE_SET_KEY = "ana:keys";

const cacheResult = async <T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T> => {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    console.warn("[analytics] cache read failed", { key, error });
  }

  const result = await compute();

  try {
    await redis.set(key, JSON.stringify(result), "EX", ttlSeconds);
    await redis.sadd(CACHE_SET_KEY, key);
  } catch (error) {
    console.warn("[analytics] cache write failed", { key, error });
  }

  return result;
};

export const invalidateAnalyticsCache = async (): Promise<void> => {
  try {
    const keys = await redis.smembers(CACHE_SET_KEY);
    if (keys.length) {
      await redis.del(...keys);
      await redis.del(CACHE_SET_KEY);
    }
  } catch (error) {
    console.warn("[analytics] cache invalidation failed", { error });
  }
};

const convertCostToINR = (amount: number, currency: string | undefined): number => {
  const safeCurrency = (currency ?? "INR") as SupportedCurrency;
  if (safeCurrency === "INR") {
    return amount;
  }
  return convertCents(amount, safeCurrency, "INR");
};

const buildMatchStage = ({ from, to }: { from: Date; to: Date }) => ({
  createdAt: {
    $gte: from,
    $lte: to
  }
});

export const analyticsService = {
  async getSummary(params: SummaryParams) {
    const { from, to } = params;
    const cacheKey = `ana:summary:${from.toISOString()}:${to.toISOString()}`;
    return cacheResult(cacheKey, 600, async () => {
      const match = buildMatchStage({ from, to });

      const [metric, costs, activeUsers] = await Promise.all([
        TokenUsageModel.aggregate<{
          totalTokens: number;
          avgLatencyMs: number;
          turns: number;
        }>([
          { $match: match },
          {
            $group: {
              _id: null,
              totalTokens: { $sum: "$totalTokens" },
              avgLatencyMs: { $avg: "$latencyMs" },
              turns: { $sum: 1 }
            }
          }
        ]),
        TokenUsageModel.aggregate<{ _id: string; totalCostCents: number }>([
          { $match: match },
          {
            $group: {
              _id: "$currency",
              totalCostCents: { $sum: "$finalCostCents" }
            }
          }
        ]),
        TokenUsageModel.distinct("userId", match)
      ]);

      const totals = metric[0] ?? { totalTokens: 0, avgLatencyMs: 0, turns: 0 };
      const totalCostCents = costs.reduce((sum, entry) => {
        if (!entry) return sum;
        return sum + convertCostToINR(entry.totalCostCents ?? 0, entry._id ?? "INR");
      }, 0);

      return {
        totalTokens: totals.totalTokens ?? 0,
        totalCostCents,
        avgLatencyMs: totals.avgLatencyMs ?? 0,
        activeUsers: activeUsers.length,
        turns: totals.turns ?? 0
      };
    });
  },

  async getTimeseries(params: TimeseriesParams) {
    const { from, to, interval, timezone } = params;
    const cacheKey = `ana:timeseries:${from.toISOString()}:${to.toISOString()}:${interval}:${timezone ?? "utc"}`;
    return cacheResult(cacheKey, 600, async () => {
      const match = buildMatchStage({ from, to });

      const truncate = {
        date: "$createdAt",
        unit: interval,
        timezone: timezone ?? "UTC"
      } as const;

      const [baseBuckets, costBuckets] = await Promise.all([
        TokenUsageModel.aggregate<{
          _id: Date;
          tokens: number;
          turns: number;
          totalLatencyMs: number;
        }>([
          { $match: match },
          {
            $group: {
              _id: { $dateTrunc: truncate },
              tokens: { $sum: "$totalTokens" },
              turns: { $sum: 1 },
              totalLatencyMs: { $sum: "$latencyMs" }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        TokenUsageModel.aggregate<{
          _id: Date;
          costs: Array<{ currency: string; totalCostCents: number }>;
        }>([
          { $match: match },
          {
            $group: {
              _id: {
                bucket: { $dateTrunc: truncate },
                currency: "$currency"
              },
              totalCostCents: { $sum: "$finalCostCents" }
            }
          },
          {
            $group: {
              _id: "$_id.bucket",
              costs: {
                $push: {
                  currency: "$_id.currency",
                  totalCostCents: "$totalCostCents"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
      ]);

      const costMap = new Map<string, Array<{ currency: string; totalCostCents: number }>>();
      costBuckets.forEach((entry) => {
        costMap.set(new Date(entry._id).toISOString(), entry.costs ?? []);
      });

      if (!baseBuckets.length) {
        return {
          labels: [],
          tokens: [],
          costCents: [],
          turns: [],
          avgLatencyMs: []
        };
      }

      const labels: string[] = [];
      const tokens: number[] = [];
      const costCents: number[] = [];
      const turns: number[] = [];
      const avgLatencyMs: number[] = [];

      const intervalAdders: Record<IntervalUnit, (date: Date) => Date> = {
        day: (date: Date) => addDays(date, 1),
        week: (date: Date) => addWeeks(date, 1),
        month: (date: Date) => addMonths(date, 1)
      };

      const bucketMap = new Map(baseBuckets.map((entry) => [new Date(entry._id).toISOString(), entry]));
      const firstBucketDate = new Date(baseBuckets[0]._id);
      const intervalAdder = intervalAdders[interval];

      for (let cursor = new Date(firstBucketDate); cursor <= to; cursor = intervalAdder(cursor)) {
        const key = cursor.toISOString();
        const bucket = bucketMap.get(key);
        const baseCost = costMap.get(key) ?? [];

        labels.push(key);
        tokens.push(bucket?.tokens ?? 0);
        turns.push(bucket?.turns ?? 0);
        const latencyTotal = bucket?.totalLatencyMs ?? 0;
        const turnCount = bucket?.turns ?? 0;
        avgLatencyMs.push(turnCount > 0 ? latencyTotal / turnCount : 0);

        const totalCost = baseCost.reduce((sum, entry) => {
          return sum + convertCostToINR(entry.totalCostCents ?? 0, entry.currency ?? "INR");
        }, 0);
        costCents.push(totalCost);
      }

      return { labels, tokens, costCents, turns, avgLatencyMs };
    });
  },

  async getTopUsers(params: TopParams) {
    const { from, to, limit } = params;
    const cacheKey = `ana:top-users:${from.toISOString()}:${to.toISOString()}:${limit}`;
    return cacheResult(cacheKey, 600, async () => {
      const match = buildMatchStage({ from, to });

      const results = await TokenUsageModel.aggregate<{
        _id: Types.ObjectId;
        totalTokens: number;
        totalCostCents: number;
        turns: number;
        avgLatencyMs: number;
        currencyBreakdown: Array<{ currency: string; total: number }>;
      }>([
        { $match: match },
        {
          $group: {
            _id: "$userId",
            totalTokens: { $sum: "$totalTokens" },
            turns: { $sum: 1 },
            avgLatencyMs: { $avg: "$latencyMs" },
            currencyBreakdown: {
              $push: {
                currency: "$currency",
                total: "$finalCostCents"
              }
            }
          }
        },
        { $sort: { totalTokens: -1 } },
        { $limit: limit }
      ]);

      const userIds = results.map((r) => r._id);
      const users = await UserModel.find({ _id: { $in: userIds } })
        .select({ email: 1 })
        .lean()
        .exec();
      const userEmailMap = new Map(users.map((user) => [user._id.toString(), user.email ?? ""]));

      return results.map((entry) => {
        const cost = (entry.currencyBreakdown ?? []).reduce((sum, record) => {
          return sum + convertCostToINR(record.total ?? 0, record.currency ?? "INR");
        }, 0);
        return {
          userId: entry._id.toHexString(),
          email: userEmailMap.get(entry._id.toHexString()) ?? "",
          totalTokens: entry.totalTokens ?? 0,
          totalCostCents: cost,
          turns: entry.turns ?? 0,
          avgLatencyMs: entry.avgLatencyMs ?? 0
        };
      });
    });
  },

  async getTopModels(params: TopParams) {
    const { from, to, limit } = params;
    const cacheKey = `ana:top-models:${from.toISOString()}:${to.toISOString()}:${limit}`;
    return cacheResult(cacheKey, 600, async () => {
      const match = buildMatchStage({ from, to });

      const results = await TokenUsageModel.aggregate<{
        _id: { provider: string; model: string };
        totalTokens: number;
        turns: number;
        avgLatencyMs: number;
        currencyBreakdown: Array<{ currency: string; total: number }>;
      }>([
        { $match: match },
        {
          $group: {
            _id: { provider: "$provider", model: "$model" },
            totalTokens: { $sum: "$totalTokens" },
            turns: { $sum: 1 },
            avgLatencyMs: { $avg: "$latencyMs" },
            currencyBreakdown: {
              $push: { currency: "$currency", total: "$finalCostCents" }
            }
          }
        },
        { $sort: { totalTokens: -1 } },
        { $limit: limit }
      ]);

      return results.map((entry) => {
        const cost = (entry.currencyBreakdown ?? []).reduce((sum, record) => {
          return sum + convertCostToINR(record.total ?? 0, record.currency ?? "INR");
        }, 0);
        return {
          provider: entry._id.provider ?? "",
          model: entry._id.model ?? "",
          totalTokens: entry.totalTokens ?? 0,
          totalCostCents: cost,
          turns: entry.turns ?? 0,
          avgLatencyMs: entry.avgLatencyMs ?? 0
        };
      });
    });
  },

  async getDistribution(params: DistributionParams) {
    const { from, to } = params;
    const cacheKey = `ana:distribution:${from.toISOString()}:${to.toISOString()}`;
    return cacheResult(cacheKey, 900, async () => {
      const match = buildMatchStage({ from, to });

      const [byProvider, byUserTotals] = await Promise.all([
        TokenUsageModel.aggregate<{
          _id: string;
          totalTokens: number;
        }>([
          { $match: match },
          {
            $group: {
              _id: "$provider",
              totalTokens: { $sum: "$totalTokens" }
            }
          }
        ]),
        TokenUsageModel.aggregate<{
          _id: Types.ObjectId;
          totalTokens: number;
        }>([
          { $match: match },
          {
            $group: {
              _id: "$userId",
              totalTokens: { $sum: "$totalTokens" }
            }
          }
        ])
      ]);

      const userIds = byUserTotals.map((entry) => entry._id);
      const userPlans = await UserModel.find({ _id: { $in: userIds } })
        .select({ plan: 1 })
        .lean()
        .exec();
      const planMap = new Map(userPlans.map((user) => [user._id.toString(), user.plan ?? "free"]));

      const planTotals = new Map<string, number>();
      byUserTotals.forEach((entry) => {
        const planKey = planMap.get(entry._id.toHexString()) ?? "unknown";
        planTotals.set(planKey, (planTotals.get(planKey) ?? 0) + (entry.totalTokens ?? 0));
      });

      const totalTokensProvider = byProvider.reduce((sum, entry) => sum + (entry.totalTokens ?? 0), 0);
      const totalTokensPlan = Array.from(planTotals.values()).reduce((sum, val) => sum + val, 0);

      return {
        byProvider: byProvider.map((entry) => ({
          provider: entry._id ?? "unknown",
          totalTokens: entry.totalTokens ?? 0,
          pct: totalTokensProvider > 0 ? (entry.totalTokens ?? 0) / totalTokensProvider : 0
        })),
        byPlan: Array.from(planTotals.entries()).map(([planKey, totalTokens]) => ({
          planKey,
          totalTokens,
          pct: totalTokensPlan > 0 ? totalTokens / totalTokensPlan : 0
        }))
      };
    });
  },

  async getCohorts(params: CohortParams) {
    const { start, weeks } = params;
    const end = addWeeks(start, weeks);

    const cohortUsers = await UserModel.find({
      createdAt: {
        $gte: start,
        $lt: end
      }
    })
      .select({ createdAt: 1 })
      .lean()
      .exec();

    if (cohortUsers.length === 0) {
      return {
        cohorts: [],
        cohortSizes: [],
        retention: []
      };
    }

    const cohortMap = new Map<string, { cohortStart: Date; userId: Types.ObjectId }>();
    const cohortSizes = new Map<string, number>();

    cohortUsers.forEach((user) => {
      const cohortStart = startOfDay(addDays(user.createdAt, -((user.createdAt.getUTCDay() + 6) % 7)));
      const key = user._id.toString();
      cohortMap.set(key, { cohortStart, userId: user._id });
      const bucketKey = cohortStart.toISOString();
      cohortSizes.set(bucketKey, (cohortSizes.get(bucketKey) ?? 0) + 1);
    });

    const usageCursor = TokenUsageModel.find({
      userId: { $in: Array.from(cohortMap.values()).map((entry) => entry.userId) },
      createdAt: { $gte: start, $lt: addWeeks(end, weeks) }
    })
      .select({ userId: 1, createdAt: 1, totalTokens: 1 })
      .cursor();

    const cohortBuckets = new Map<string, { tokens: number; users: Set<string> }>();

    for await (const doc of usageCursor) {
      const info = cohortMap.get(doc.userId.toString());
      if (!info) continue;
      const weekIndex = differenceInCalendarWeeks(doc.createdAt, info.cohortStart, { weekStartsOn: 1 });
      if (weekIndex < 0 || weekIndex >= weeks) continue;
      const bucketKey = `${info.cohortStart.toISOString()}::${weekIndex}`;
      let bucket = cohortBuckets.get(bucketKey);
      if (!bucket) {
        bucket = { tokens: 0, users: new Set<string>() };
        cohortBuckets.set(bucketKey, bucket);
      }
      bucket.tokens += doc.totalTokens ?? 0;
      bucket.users.add(doc.userId.toString());
    }

    const cohorts = Array.from(cohortBuckets.entries()).map(([key, value]) => {
      const [cohortStartISO, weekIndexRaw] = key.split("::");
      return {
        cohortStartISO,
        weekIndex: Number(weekIndexRaw),
        users: value.users.size,
        tokens: value.tokens
      };
    });

    const retention = cohorts.map((entry) => {
      const cohortSize = cohortSizes.get(entry.cohortStartISO) ?? 0;
      return {
        cohortStartISO: entry.cohortStartISO,
        weekIndex: entry.weekIndex,
        activePct: cohortSize > 0 ? entry.users / cohortSize : 0
      };
    });

    return {
      cohorts,
      cohortSizes: Array.from(cohortSizes.entries()).map(([cohortStartISO, users]) => ({
        cohortStartISO,
        users
      })),
      retention
    };
  }
};
