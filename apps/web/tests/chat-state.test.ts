import { describe, expect, it } from "vitest";
import { chatReducer, createInitialState, createPendingTurn } from "../src/lib/chat/state";
import { PROVIDER_MODELS } from "../src/lib/chat/types";

const defaultModel = PROVIDER_MODELS[0]?.id ?? "openai:gpt-4.1-mini";

const defaultProject = "project-1";

describe("chatReducer", () => {
  it("appends a turn and streams content deltas", () => {
    const initial = createInitialState("session-test", defaultModel, defaultProject);
    const turn = createPendingTurn("turn-1", "Hello there", defaultModel, [], defaultProject);

    const withTurn = chatReducer(initial, { type: "append-turn", turn });
    expect(withTurn.session.turns).toHaveLength(1);
    expect(withTurn.session.turns[0].answer.content).toBe("");

    const withContent = chatReducer(withTurn, {
      type: "append-answer-content",
      turnId: "turn-1",
      delta: "Mock delta ",
    });

    const finalState = chatReducer(withContent, {
      type: "append-answer-content",
      turnId: "turn-1",
      delta: "chunk",
    });

    expect(finalState.session.turns[0].answer.content).toBe("Mock delta chunk");
  });

  it("updates answer metadata on completion", () => {
    const initial = createInitialState("session-test", defaultModel, defaultProject);
    const turn = createPendingTurn("turn-2", "Summarize this", defaultModel, [], defaultProject);
    const withTurn = chatReducer(initial, { type: "append-turn", turn });

    const completed = chatReducer(withTurn, {
      type: "update-answer",
      turnId: "turn-2",
      patch: {
        status: "complete",
        tokensIn: 12,
        tokensOut: 48,
        costCents: 32,
        latencyMs: 850,
        finishReason: "stop",
      },
    });

    const answer = completed.session.turns[0].answer;
    expect(answer.status).toBe("complete");
    expect(answer.tokensIn).toBe(12);
    expect(answer.latencyMs).toBe(850);
    expect(answer.finishReason).toBe("stop");
  });

  it("updates session meta information and input value", () => {
    const initial = createInitialState("session-test", defaultModel, defaultProject);

    const withModel = chatReducer(initial, {
      type: "update-last-model",
      modelId: defaultModel,
    });

    expect(withModel.session.lastModelId).toBe(defaultModel);

    const withInput = chatReducer(withModel, { type: "set-input", value: "Draft a headline" });
    expect(withInput.inputValue).toBe("Draft a headline");

    const idle = chatReducer(withInput, { type: "set-streaming", value: true });
    expect(idle.isStreaming).toBe(true);

    const withProjectChange = chatReducer(idle, { type: "set-active-project", projectId: "project-2" });
    expect(withProjectChange.session.activeProjectId).toBe("project-2");
  });
});
