import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../models", () => {
  const sort = vi.fn();
  const find = vi.fn(() => ({ sort }));
  return {
    DailyMetricsModel: {
      find
    }
  };
});

import { kpiService } from "../services/kpiService";
import { DailyMetricsModel } from "../models";

describe("kpiService.getOverview", () => {
    beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates tokens by provider", async () => {
    const exec = vi.fn().mockResolvedValue([
      {
        date: new Date(),
        dau: 10,
        wau: 50,
        mau: 120,
        newSignups: 5,
        activePaid: 20,
        mrr: 10000,
        churn: 2,
        arpu: 500,
        planMix: { free: 80, starter: 20 },
        tokensInByProvider: { openai: 1000, ollama: 200 },
        tokensOutByProvider: { openai: 800, ollama: 100 }
      }
    ]);
    const lean = vi.fn().mockReturnValue({ exec });
    const sort = vi.fn().mockReturnValue({ lean });
    (DailyMetricsModel.find as unknown as vi.Mock).mockReturnValue({ sort });

    const result = await kpiService.getOverview({ range: "7d" });

    expect(sort).toHaveBeenCalledWith({ date: 1 });
    expect(result.tokenBurnByProvider.openai).toEqual({ in: 1000, out: 800 });
    expect(result.dau).toBe(10);
    expect(result.range).toBe("7d");
    expect(result.trend).toHaveLength(1);
    expect(result.trend[0].tokens.openai).toEqual({ in: 1000, out: 800 });
  });
});
