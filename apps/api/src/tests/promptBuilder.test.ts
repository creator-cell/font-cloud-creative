import { describe, expect, it } from "vitest";
import { buildPrompt } from "../services/promptBuilder.js";

describe("buildPrompt", () => {
  it("builds prompts with style card context", () => {
    const result = buildPrompt({
      type: "ad",
      inputs: { product: "Eco Bottle" },
      styleCard: {
        tone: ["confident"],
        cadence: "snappy",
        readingLevel: "Grade 8",
        powerWords: ["sustainable"],
        taboo: ["cheap"],
        dos: ["Highlight reusability"],
        donts: ["Mention price"],
        language: "en"
      },
      claimsMode: true
    });

    expect(result.system).toContain("Front Cloud Creative");
    expect(result.system).toContain("Tone: confident");
    expect(result.user).toContain("Content type: ad");
    expect(result.user).toContain("claims field");
    expect(result.user).toContain("Eco Bottle");
  });
});
