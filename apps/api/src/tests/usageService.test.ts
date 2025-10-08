import { describe, expect, it, vi, beforeEach } from "vitest";
import { bumpUsage } from "../services/usageService";
import { UsageModel } from "../models";

const mockSave = vi.fn();

vi.mock("../models", () => {
  const overrideExec = vi.fn().mockResolvedValue(null);
  return {
    UsageModel: {
      findOneAndUpdate: vi.fn()
    },
    TokenPolicyOverrideModel: {
      findOne: vi.fn(() => ({
        lean: () => ({ exec: overrideExec })
      }))
    }
  };
});

vi.mock("../config/env", () => ({
  env: {
    quotas: {
      free: 15000,
      starter: 300000,
      pro: 1000000,
      team: 3000000
    }
  }
}));

describe("bumpUsage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSave.mockReset();
  });

  it("increments usage counters and flags soft warning", async () => {
    const usageDoc = {
      userId: "user",
      monthKey: "2024-05",
      tokensIn: 14000,
      tokensOut: 0,
      generations: 1,
      softWarned: false,
      save: mockSave.mockResolvedValue(null)
    } as any;

    const mockedFind = UsageModel.findOneAndUpdate as unknown as vi.Mock;
    mockedFind.mockResolvedValue(usageDoc);

    const updated = await bumpUsage("507f1f77bcf86cd799439011", "free", 500, 500);

    expect(updated.tokensIn).toBe(14500);
    expect(updated.tokensOut).toBe(500);
    expect(updated.generations).toBe(2);
    expect(updated.softWarned).toBe(true);
    expect(mockSave).toHaveBeenCalled();
  });
});
