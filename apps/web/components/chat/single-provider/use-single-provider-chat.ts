"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import type { ProjectSummary, ProviderModelSummary } from "@/lib/api/endpoints";
import { Provider, type ChatAttachment, type ChatTurn } from "@/src/lib/chat/types";
import { chatReducer, createInitialState, createPendingTurn } from "@/src/lib/chat/state";
import { createChatTurn, openChatStream } from "@/src/lib/chat/api";
import { useApiErrorHandler } from "@/hooks/use-api-error-handler";
import {
  DEFAULT_MODEL_VALUE,
  formatModelValue,
  formatPlanName,
  formatProviderLabel,
  parseModelValue,
  resolveProviderFromModel,
  type ModelOption,
} from "./utils";
import type { PendingAttachment } from "./pending-attachments";

const STREAM_TIMEOUT_MS = 45_000;
const STORAGE_KEY = "frontcloud.single-chat.model";
const PROJECT_STORAGE_KEY = "frontcloud.single-chat.project";
const MAX_INLINE_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

type StreamControllers = {
  source: EventSource | null;
  timeout: number | null;
};

export const useSingleProviderChat = ({
  projects,
  models,
}: {
  projects: ProjectSummary[];
  models: ProviderModelSummary[];
}) => {
  const modelOptions = useMemo<ModelOption[]>(() => {
    const options: ModelOption[] = [];
    models.forEach((group) => {
      group.models.forEach((model) => {
        const value = formatModelValue(group.provider, model.id);
        options.push({
          value,
          label: `${formatProviderLabel(group.provider)} · ${model.label}`,
          provider: group.provider,
          modelId: model.id,
          available: model.available,
          minPlan: model.minPlan,
        });
      });
    });
    return options;
  }, [models]);

  const fallbackModelValue = useMemo(
    () => modelOptions.find((option) => option.available)?.value ?? modelOptions[0]?.value ?? DEFAULT_MODEL_VALUE,
    [modelOptions]
  );

  const initialModel = useMemo(() => {
    if (typeof window === "undefined") return fallbackModelValue;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && modelOptions.some((option) => option.value === stored)) {
      return stored;
    }
    return fallbackModelValue;
  }, [fallbackModelValue, modelOptions]);

  const initialProjectId = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(PROJECT_STORAGE_KEY);
      if (stored && projects.some((project) => project._id === stored)) {
        return stored;
      }
    }
    return projects[0]?._id ?? null;
  }, [projects]);

  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `session-${Date.now()}`;
  }, []);

  const [state, dispatch] = useReducer(
    chatReducer,
    createInitialState(sessionId, initialModel, initialProjectId)
  );

  const controllersRef = useRef<StreamControllers>({ source: null, timeout: null });
  const activeTurnRef = useRef<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
  const [showTips, setShowTips] = useState(false);

  const projectMap = useMemo(() => {
    const map = new Map<string, ProjectSummary>();
    projects.forEach((project) => map.set(project._id, project));
    return map;
  }, [projects]);

  const selectedModelOption = useMemo(
    () => modelOptions.find((option) => option.value === state.session.lastModelId) ?? null,
    [modelOptions, state.session.lastModelId]
  );

  const modelUnavailable = selectedModelOption ? !selectedModelOption.available : modelOptions.length > 0;
  const hasTurns = state.session.turns.length > 0;

  useEffect(() => {
    if (modelOptions.length === 0) return;
    const exists = modelOptions.some((option) => option.value === state.session.lastModelId);
    if (!exists) {
      const fallback = modelOptions.find((option) => option.available) ?? modelOptions[0];
      if (fallback && fallback.value !== state.session.lastModelId) {
        dispatch({ type: "update-last-model", modelId: fallback.value });
      }
    }
  }, [modelOptions, state.session.lastModelId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, state.session.lastModelId);
  }, [state.session.lastModelId]);

  useEffect(() => {
    if (selectedProjectId && !projectMap.has(selectedProjectId)) {
      const fallback = projects[0]?._id ?? null;
      setSelectedProjectId(fallback);
      return;
    }
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projectMap, projects, selectedProjectId]);

  useEffect(() => () => {
    if (controllersRef.current.source) {
      controllersRef.current.source.close();
    }
    if (controllersRef.current.timeout !== null) {
      window.clearTimeout(controllersRef.current.timeout);
      controllersRef.current.timeout = null;
    }
  }, []);

  const handleModelChange = (value: string) => {
    dispatch({ type: "update-last-model", modelId: value });
    setStatusMessage(null);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setStatusMessage(null);
  };

  const setInputValue = (value: string) => {
    dispatch({ type: "set-input", value });
  };

  const resetStreaming = useCallback(() => {
    activeTurnRef.current = null;
    if (controllersRef.current.timeout !== null) {
      window.clearTimeout(controllersRef.current.timeout);
      controllersRef.current.timeout = null;
    }
    if (controllersRef.current.source) {
      controllersRef.current.source.close();
      controllersRef.current.source = null;
    }
  }, []);

  const handleStreamTimeout = useCallback(
    (turnId: string) => {
      dispatch({
        type: "update-answer",
        turnId,
        patch: { status: "timeout", errorMessage: "This response took too long. Try again." },
      });
      setStatusMessage("Response timed out. Try again.");
      resetStreaming();
    },
    [resetStreaming]
  );

  const beginStreaming = useCallback(
    (turn: ChatTurn, streamUrl: string) => {
      activeTurnRef.current = turn.id;
      dispatch({ type: "append-turn", turn });

      const scheduleTimeout = () => {
        if (controllersRef.current.timeout !== null) {
          window.clearTimeout(controllersRef.current.timeout);
        }
        controllersRef.current.timeout = window.setTimeout(
          () => handleStreamTimeout(turn.id),
          STREAM_TIMEOUT_MS
        );
      };

      scheduleTimeout();

      controllersRef.current.source = openChatStream(streamUrl, {
        onStart: (event) => {
          const providerId = (event.provider as Provider) || resolveProviderFromModel(event.model);
          const modelValue = formatModelValue(providerId, event.model);
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: {
              provider: providerId,
              model: modelValue,
              status: "streaming",
            },
          });
          scheduleTimeout();
        },
        onDelta: (event) => {
          scheduleTimeout();
          dispatch({
            type: "append-answer-content",
            turnId: turn.id,
            delta: event.text_delta,
          });
        },
        onEnd: (event) => {
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: {
              status: "complete",
              tokensIn: event.tokens_in,
              tokensOut: event.tokens_out,
              costCents: event.cost_cents,
              latencyMs: event.latency_ms,
              finishReason: event.finish_reason,
              completedAt: Date.now(),
            },
          });
        },
        onError: (event) => {
          let errorMessage = event.message;
          if (errorMessage === "Unknown streaming error") {
            errorMessage = "Connection error. Please try again.";
          }
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: { status: "error", errorMessage },
          });
          if (event.code === 401) {
            handleError(new Error(errorMessage));
          } else {
            setStatusMessage(errorMessage);
          }
          dispatch({ type: "set-streaming", value: false });
          resetStreaming();
        },
        onComplete: () => {
          resetStreaming();
        },
      });
    },
    [handleStreamTimeout, resetStreaming]
  );

  const serializeAttachments = useCallback(async () => {
    if (pendingAttachments.length === 0) return [] as ChatAttachment[];
    setIsPreparingAttachments(true);
    try {
      const attachments = await Promise.all(
        pendingAttachments.map(async ({ id, file }) => {
          const base: ChatAttachment = {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
          };
          if (file.size > MAX_INLINE_FILE_BYTES) {
            return base;
          }
          const dataUrl = await readFileAsDataUrl(file);
          return { ...base, dataUrl };
        })
      );
      return attachments;
    } finally {
      setIsPreparingAttachments(false);
    }
  }, [pendingAttachments]);

  const handleFilesAdded = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const selections = files.map((file) => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${file.name}-${Date.now()}`,
      file,
    }));

    setPendingAttachments((previous) => [...previous, ...selections]);
    setStatusMessage(null);
  }, []);

  const handleError = useApiErrorHandler();
  
  const sendMessage = useCallback(
    async (options?: {
      message?: string;
      modelId?: string;
      attachments?: ChatAttachment[];
      projectId?: string | null;
    }) => {
      const rawMessage = options?.message ?? state.inputValue;
      const trimmed = rawMessage.trim();
      if (!trimmed) return;
      const projectId = options?.projectId ?? selectedProjectId;
      if (!projectId) {
        setStatusMessage("Select a project to tag this analysis.");
        return;
      }

      setStatusMessage(null);

      const selectionValue = options?.modelId ?? state.session.lastModelId;
      let resolvedOption: ModelOption | undefined;
      if (selectionValue) {
        resolvedOption = modelOptions.find((option) => option.value === selectionValue);
        if (!resolvedOption) {
          const parsed = parseModelValue(selectionValue);
          if (parsed.provider && parsed.modelId) {
            resolvedOption = {
              value: selectionValue,
              provider: parsed.provider,
              modelId: parsed.modelId,
              label: `${formatProviderLabel(parsed.provider)} · ${parsed.modelId}`,
              available: true,
              minPlan: "",
            };
          }
        }
      }

      if (!resolvedOption) {
        setStatusMessage("Select a model to continue.");
        return;
      }

      const isKnownOption = modelOptions.some((option) => option.value === resolvedOption!.value);
      if (isKnownOption && !resolvedOption.available) {
        setStatusMessage(
          resolvedOption.minPlan
            ? `Your plan does not include this model (requires ${formatPlanName(resolvedOption.minPlan)} plan).`
            : "Your plan does not include this model."
        );
        return;
      }

      let { provider, modelId } = resolvedOption;
      if (!provider) {
        provider = resolveProviderFromModel(modelId);
      }
      if (!modelId) {
        setStatusMessage("Model selection is invalid.");
        return;
      }

      const attachments =
        options?.attachments !== undefined ? options.attachments : await serializeAttachments();

      if (!options?.attachments) {
        setPendingAttachments([]);
      }

      dispatch({ type: "set-streaming", value: true });

      const payload = {
        sessionId: state.session.id,
        message: trimmed,
        model: modelId,
        provider,
        projectId: projectId ?? undefined,
        attachments: attachments.map(({ id, name, size, type, dataUrl }) => ({
          id,
          name,
          size,
          type,
          dataUrl,
        })),
      };

      try {
        const { turnId, streamUrl } = await createChatTurn(payload);
        const pendingTurn = createPendingTurn(turnId, trimmed, resolvedOption.value, attachments, projectId);
        beginStreaming(pendingTurn, streamUrl);
        if (!options?.message) {
          setInputValue("");
        }
      } catch (error) {
        dispatch({ type: "set-streaming", value: false });
        handleError(error as Error);
        if (!options?.message) {
          setInputValue(rawMessage);
        }
      }
    },
    [
      beginStreaming,
      modelOptions,
      selectedProjectId,
      serializeAttachments,
      state.inputValue,
      state.session.id,
      state.session.lastModelId,
    ]
  );

  const retryTurn = (turn: ChatTurn) => {
    if (state.isStreaming) return;
    void sendMessage({
      message: turn.userMessage,
      modelId: turn.answer.model,
      attachments: turn.attachments,
      projectId: turn.projectId ?? null,
    });
  };

  const copyTurn = async (turn: ChatTurn) => {
    try {
      await navigator.clipboard.writeText(turn.answer.content);
      setStatusMessage("Response copied to clipboard.");
    } catch {
      setStatusMessage("Unable to copy response. Please try again.");
    }
  };

  const onTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    handleFilesAdded(files);
    event.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((previous) => previous.filter((item) => item.id !== id));
  };

  const showSendDisabled =
    state.isStreaming ||
    !state.inputValue.trim() ||
    isPreparingAttachments ||
    !selectedProjectId ||
    modelUnavailable ||
    modelOptions.length === 0;

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current += 1;
    if (event.dataTransfer?.items?.length) {
      setIsDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    dragCounter.current = 0;

    const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file && file.size >= 0);
    handleFilesAdded(files);
  };

  const scrollChatToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = chatScrollRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    },
    []
  );

  useEffect(() => {
    if (state.session.turns.length === 0) return;
    scrollChatToBottom(state.isStreaming ? "auto" : "smooth");
  }, [state.session.turns, state.isStreaming, scrollChatToBottom]);

  return {
    modelOptions,
    selectedModelValue: state.session.lastModelId,
    selectedModelOption,
    modelUnavailable,
    handleModelChange,
    projects,
    selectedProjectId,
    handleProjectChange,
    pendingAttachments,
    removeAttachment,
    showTips,
    toggleTips: () => setShowTips((prev) => !prev),
    hasTurns,
    chatTurns: state.session.turns,
    projectMap,
    retryTurn,
    copyTurn,
    sendMessage,
    inputValue: state.session.inputValue,
    setInputValue,
    onTextareaKeyDown,
    isStreaming: state.isStreaming,
    showSendDisabled,
    isPreparingAttachments,
    statusMessage,
    isDragActive,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    onFileInputChange,
    chatScrollRef,
    fileInputRef,
    triggerUpload: () => fileInputRef.current?.click(),
  };
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
