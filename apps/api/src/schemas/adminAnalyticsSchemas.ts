import { z } from "zod";

const parseDate = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
};

const baseRangeObject = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  tz: z.string().optional()
});

const mapRange = (input: z.infer<typeof baseRangeObject>) => {
  const to = parseDate(input.to) ?? new Date();
  const defaultFrom = new Date(to);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);
  const from = parseDate(input.from) ?? defaultFrom;
  if (from > to) {
    throw new Error("`from` must be earlier than `to`");
  }
  return {
    from,
    to,
    timezone: input.tz ?? "UTC"
  } as const;
};

export const analyticsSummaryQuerySchema = baseRangeObject.transform(mapRange);

export const analyticsTimeseriesQuerySchema = baseRangeObject
  .extend({
    interval: z.enum(["day", "week", "month"]).default("day")
  })
  .transform((input) => ({
    ...mapRange(input),
    interval: input.interval
  }));

export const analyticsTopQuerySchema = baseRangeObject
  .extend({
    limit: z.coerce.number().int().positive().max(200).default(20)
  })
  .transform((input) => ({
    ...mapRange(input),
    limit: input.limit
  }));

export const analyticsDistributionQuerySchema = baseRangeObject.transform(mapRange);

export const analyticsCohortQuerySchema = z
  .object({
    start: z.string(),
    weeks: z.coerce.number().int().positive().max(26).default(8)
  })
  .transform((input) => {
    const start = parseDate(input.start);
    if (!start) {
      throw new Error("start is required");
    }
    start.setUTCHours(0, 0, 0, 0);
    return {
      start,
      weeks: input.weeks
    };
  });

export const analyticsExportQuerySchema = baseRangeObject
  .extend({
    type: z.enum(["users", "models", "timeseries"]),
    interval: z.enum(["day", "week", "month"]).default("day"),
    limit: z.coerce.number().int().positive().max(1000).default(200)
  })
  .transform((input) => ({
    ...mapRange(input),
    type: input.type,
    interval: input.interval,
    limit: input.limit
  }));
