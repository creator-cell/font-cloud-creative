import { subDays } from "date-fns";
import { DailyMetricsModel } from "../models";

export interface OverviewInput {
  range?: "7d" | "30d" | "90d";
}

export interface OverviewTrendPoint {
  date: string;
  tokens: Record<string, { in: number; out: number }>;
  planMix: Record<string, number>;
  signups: number;
  dau: number;
}

export interface OverviewResponse {
  range: string;
  dau: number;
  wau: number;
  mau: number;
  newSignups: number;
  activePaid: number;
  mrr: number;
  churn: number;
  arpu: number;
  tokenBurnByProvider: Record<string, { in: number; out: number }>;
  planMix: Record<string, number>;
  trend: OverviewTrendPoint[];
}

const RANGE_TO_DAYS: Record<OverviewInput["range"], number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90
};

export const kpiService = {
  async getOverview({ range = "30d" }: OverviewInput = {}): Promise<OverviewResponse> {
    const days = RANGE_TO_DAYS[range] ?? 30;
    const windowStart = subDays(new Date(), days - 1);

    const metrics = await DailyMetricsModel.find({ date: { $gte: windowStart } })
      .sort({ date: 1 })
      .lean()
      .exec();

    const latest = metrics[metrics.length - 1];

    const aggregateTokens: Record<string, { in: number; out: number }> = {};
    let totalSignups = 0;

    const trend: OverviewTrendPoint[] = metrics.map((metric) => {
      totalSignups += metric.newSignups ?? 0;
      const tokensIn = metric.tokensInByProvider ?? {};
      const tokensOut = metric.tokensOutByProvider ?? {};
      const providers = new Set([
        ...Object.keys(tokensIn),
        ...Object.keys(tokensOut)
      ]);

      const entry: OverviewTrendPoint = {
        date: metric.date ? new Date(metric.date).toISOString() : new Date().toISOString(),
        tokens: {},
        planMix: metric.planMix ?? {},
        signups: metric.newSignups ?? 0,
        dau: metric.dau ?? 0
      };

      providers.forEach((provider) => {
        const inVal = tokensIn[provider] ?? 0;
        const outVal = tokensOut[provider] ?? 0;
        entry.tokens[provider] = { in: inVal, out: outVal };

        if (!aggregateTokens[provider]) {
          aggregateTokens[provider] = { in: 0, out: 0 };
        }
        aggregateTokens[provider].in += inVal;
        aggregateTokens[provider].out += outVal;
      });

      return entry;
    });

    return {
      range,
      dau: latest?.dau ?? 0,
      wau: latest?.wau ?? 0,
      mau: latest?.mau ?? 0,
      newSignups: totalSignups,
      activePaid: latest?.activePaid ?? 0,
      mrr: latest?.mrr ?? 0,
      churn: latest?.churn ?? 0,
      arpu: latest?.arpu ?? 0,
      tokenBurnByProvider: aggregateTokens,
      planMix: latest?.planMix ?? {},
      trend
    };
  }
};
