import {
  type ChatAction,
  type ChatAttachment,
  type ChatSession,
  type ChatState,
  type ChatTurn,
  createEmptyAnswer,
} from "./types";

export const createInitialSession = (sessionId: string, modelId: string): ChatSession => ({
  id: sessionId,
  turns: [],
  lastModelId: modelId,
});

export const createInitialState = (sessionId: string, modelId: string): ChatState => ({
  session: createInitialSession(sessionId, modelId),
  isStreaming: false,
  inputValue: "",
});

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "set-input":
      return { ...state, inputValue: action.value };
    case "set-streaming":
      return { ...state, isStreaming: action.value };
    case "set-session":
      return { ...state, session: action.session };
    case "update-last-model":
      return {
        ...state,
        session: {
          ...state.session,
          lastModelId: action.modelId,
        },
      };
    case "append-turn":
      return {
        ...state,
        session: {
          ...state.session,
          turns: [...state.session.turns, action.turn],
        },
      };
    case "replace-turn":
      return {
        ...state,
        session: {
          ...state.session,
          turns: state.session.turns.map((turn) => (turn.id === action.turn.id ? action.turn : turn)),
        },
      };
    case "append-answer-content":
      return {
        ...state,
        session: {
          ...state.session,
          turns: state.session.turns.map((turn) => {
            if (turn.id !== action.turnId) return turn;
            return {
              ...turn,
              answer: {
                ...turn.answer,
                content: `${turn.answer.content}${action.delta}`,
              },
            };
          }),
        },
      };
    case "update-answer":
      return {
        ...state,
        session: {
          ...state.session,
          turns: state.session.turns.map((turn) => {
            if (turn.id !== action.turnId) return turn;
            return {
              ...turn,
              answer: {
                ...turn.answer,
                ...action.patch,
              },
            };
          }),
        },
      };
    default:
      return state;
  }
};

export const createPendingTurn = (
  turnId: string,
  userMessage: string,
  modelId: string,
  attachments: ChatAttachment[]
): ChatTurn => ({
  id: turnId,
  userMessage,
  createdAt: Date.now(),
  answer: {
    ...createEmptyAnswer(turnId, modelId),
    status: "streaming",
  },
  attachments,
});
