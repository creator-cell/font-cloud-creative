import {
  type ChatAction,
  type ChatAttachment,
  type ChatSession,
  type ChatState,
  type ChatTurn,
  createEmptyAnswer,
} from "./types";

export const createInitialSession = (
  sessionId: string,
  modelId: string,
  projectId: string | null
): ChatSession => ({
  id: sessionId,
  turns: [],
  activeProjectId: projectId,
  lastModelId: modelId,
});

export const createInitialState = (sessionId: string, modelId: string, projectId: string | null): ChatState => ({
  session: createInitialSession(sessionId, modelId, projectId),
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
    case "set-active-project":
      return {
        ...state,
        session: {
          ...state.session,
          activeProjectId: action.projectId,
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
  attachments: ChatAttachment[],
  projectId: string | null
): ChatTurn => ({
  id: turnId,
  userMessage,
  createdAt: Date.now(),
  answer: {
    ...createEmptyAnswer(turnId, modelId),
    status: "streaming",
  },
  projectId: projectId ?? undefined,
  attachments,
});
