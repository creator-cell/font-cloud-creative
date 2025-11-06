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
  type ReactNode,
} from "react";
import { Copy, FileText, Loader2, Paperclip, RefreshCw, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { ProjectSummary } from "@/lib/api/endpoints";
import {
  PROVIDER_MODELS,
  getProviderFromModel,
  type ChatAttachment,
  type ChatTurn,
} from "@/src/lib/chat/types";
import { chatReducer, createInitialState, createPendingTurn } from "@/src/lib/chat/state";
import {
  createChatTurn,
  fetchChatHistory,
  openChatStream,
  type ChatHistoryTurn,
} from "@/src/lib/chat/api";
import { cn } from "@/lib/utils";
import { ChatInput } from "./chat-input";

const STREAM_TIMEOUT_MS = 45_000;
const STORAGE_KEY = "frontcloud.single-chat.model";
const PROJECT_STORAGE_KEY = "frontcloud.single-chat.project";
const MAX_INLINE_FILE_BYTES = 20 * 1024 * 1024; // 20 MB
const DEFAULT_MODEL_FALLBACK = PROVIDER_MODELS[0]?.id ?? "openai:gpt-4.1-mini";

type StreamControllers = {
  source: EventSource | null;
  timeout: number | null;
};

type PendingAttachment = {
  id: string;
  file: File;
};

type SingleProviderChatProps = {
  projects: ProjectSummary[];
  defaultModelId?: string;
};

export const SingleProviderChat = ({ projects, defaultModelId }: SingleProviderChatProps) => {
  const fallbackModelId = useMemo(() => {
    if (defaultModelId && PROVIDER_MODELS.some((model) => model.id === defaultModelId)) {
      return defaultModelId;
    }
    return DEFAULT_MODEL_FALLBACK;
  }, [defaultModelId]);

  const initialModel = useMemo(() => {
    const availableModelIds = new Set(PROVIDER_MODELS.map((model) => model.id));
    if (typeof window === "undefined") return fallbackModelId;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && availableModelIds.has(stored)) {
      return stored;
    }
    if (availableModelIds.has(fallbackModelId)) {
      return fallbackModelId;
    }
    return DEFAULT_MODEL_FALLBACK;
  }, [fallbackModelId]);

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
  const [showTips, setShowTips] = useState(false);
  const [historyCursor, setHistoryCursor] = useState<string | null>(null);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const controllersRef = useRef<StreamControllers>({ source: null, timeout: null });
  const activeTurnRef = useRef<string | null>(null);
  const historyAbortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    const handleFiles = async (files: File[]) => {
    const newFiles = files.filter(file => {
      const validTypes = ['.pdf', '.xlsx', '.xls', '.jpg', '.jpeg', '.png'];
      return validTypes.some(ext => file.name.toLowerCase().endsWith(ext)) && file.size <= 10 * 1024 * 1024;
    });    const filesData = newFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      file
    }));

    setSelectedFiles(prev => [...prev, ...filesData.map(f => ({ id: f.id, name: f.name }))]);
    setPendingAttachments(prev => [...prev, ...filesData]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
    setPendingAttachments(prev => prev.filter(f => f.id !== id));
  };
  const dragCounter = useRef(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const lastModelIdRef = useRef(state.session.lastModelId);
  const isLoadingHistoryRef = useRef(false);
  const skipAutoScrollRef = useRef(false);

  const projectMap = useMemo(() => {
    const map = new Map<string, ProjectSummary>();
    projects.forEach((project) => map.set(project._id, project));
    return map;
  }, [projects]);

  const hasTurns = state.session.turns.length > 0;

  const mapHistoryTurn = useCallback(
    (item: ChatHistoryTurn): ChatTurn => {
      const modelCandidate = item.model?.includes(":")
        ? item.model
        : `${item.provider}:${item.model}`;
      const modelId = modelCandidate || `${item.provider}:${item.modelSlug ?? ""}`;
      const startedAtMs = item.startedAt ? Date.parse(item.startedAt) : Date.parse(item.createdAt);
      const completedAtMs = item.finishedAt ? Date.parse(item.finishedAt) : undefined;
      const safeStartedAt = Number.isFinite(startedAtMs) ? startedAtMs : Date.now();
      const safeCompletedAt = completedAtMs && Number.isFinite(completedAtMs) ? completedAtMs : undefined;

      const status: ChatTurn["answer"]["status"] =
        item.status === "completed" ? "complete" : item.status === "failed" ? "error" : "idle";

      return {
        id: item.turnId,
        userMessage: item.userMessage,
        createdAt: safeStartedAt,
        projectId: item.projectId ?? undefined,
        attachments:
          item.attachments?.map((attachment) => ({
            id: attachment.id,
            name: attachment.name,
            size: attachment.size,
            type: attachment.type ?? "application/octet-stream",
            dataUrl: attachment.dataUrl,
          })) ?? [],
        answer: {
          turnId: item.turnId,
          provider: getProviderFromModel(modelId),
          model: modelId,
          content: item.response?.content ?? "",
          status,
          tokensIn: item.usage?.tokensIn,
          tokensOut: item.usage?.tokensOut,
          latencyMs: item.usage?.latencyMs,
          finishReason: item.response?.finishReason ?? undefined,
          errorMessage: item.usage?.error ?? item.error ?? undefined,
          startedAt: safeStartedAt,
          completedAt: safeCompletedAt,
        },
      };
    },
    []
  );

  const loadHistory = useCallback(
    async ({ projectId, cursor, mode }: { projectId: string; cursor?: string | null; mode: "reset" | "prepend" }) => {
      if (!projectId) return;
      if (mode === "prepend" && isLoadingHistoryRef.current) return;

      const controller = new AbortController();
      historyAbortRef.current?.abort();
      historyAbortRef.current = controller;
      isLoadingHistoryRef.current = true;
      setIsLoadingHistory(true);

      const preserveScroll = mode === "prepend";
      const container = chatScrollRef.current;
      const previousScrollHeight = preserveScroll && container ? container.scrollHeight : 0;
      const previousScrollTop = preserveScroll && container ? container.scrollTop : 0;

      try {
        const response = await fetchChatHistory(
          {
            projectId,
            cursor: cursor ?? undefined,
            limit: 20,
          },
          controller.signal
        );

        const mappedTurns = response.turns.map(mapHistoryTurn);
        setHistoryCursor(response.nextCursor);
        setHasMoreHistory(response.hasMore);

        if (mode === "reset") {
          const newSessionId =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `session-${Date.now()}`;
          dispatch({
            type: "set-session",
            session: {
              id: newSessionId,
              turns: mappedTurns,
              activeProjectId: projectId,
              lastModelId: lastModelIdRef.current,
            },
          });
          dispatch({ type: "set-streaming", value: false });
          setStatusMessage(null);
          skipAutoScrollRef.current = false;
        } else if (mappedTurns.length > 0) {
          dispatch({ type: "prepend-turns", turns: mappedTurns });
          skipAutoScrollRef.current = true;
          if (preserveScroll && container) {
            requestAnimationFrame(() => {
              const target = chatScrollRef.current;
              if (!target) return;
              const heightDelta = target.scrollHeight - previousScrollHeight;
              target.scrollTop = previousScrollTop + heightDelta;
            });
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load chat history", error);
          setStatusMessage("Unable to load previous messages.");
        }
      } finally {
        isLoadingHistoryRef.current = false;
        setIsLoadingHistory(false);
        historyAbortRef.current = null;
      }
    },
    [dispatch, mapHistoryTurn]
  );

  useEffect(() => {
    const isKnownModel = PROVIDER_MODELS.some((model) => model.id === state.session.lastModelId);
    if (!isKnownModel && state.session.lastModelId !== fallbackModelId) {
      dispatch({ type: "update-last-model", modelId: fallbackModelId });
    }
  }, [dispatch, fallbackModelId, state.session.lastModelId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, state.session.lastModelId);
  }, [state.session.lastModelId]);

  useEffect(() => {
    lastModelIdRef.current = state.session.lastModelId;
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

  useEffect(() => {
    dispatch({ type: "set-active-project", projectId: selectedProjectId ?? null });
    if (typeof window === "undefined") return;
    if (selectedProjectId) {
      window.localStorage.setItem(PROJECT_STORAGE_KEY, selectedProjectId);
    } else {
      window.localStorage.removeItem(PROJECT_STORAGE_KEY);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) {
      const emptySessionId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `session-${Date.now()}`;
      dispatch({
        type: "set-session",
        session: {
          id: emptySessionId,
          activeProjectId: null,
          lastModelId: lastModelIdRef.current,
          turns: [],
        },
      });
      setHistoryCursor(null);
      setHasMoreHistory(false);
      return;
    }
    setHistoryCursor(null);
    setHasMoreHistory(false);
    void loadHistory({ projectId: selectedProjectId, mode: "reset" });
  }, [dispatch, loadHistory, selectedProjectId]);

  useEffect(() => {
    return () => {
      if (controllersRef.current.source) {
        controllersRef.current.source.close();
      }
      if (controllersRef.current.timeout !== null) {
        window.clearTimeout(controllersRef.current.timeout);
      }
    };
  }, []);

  useEffect(() => () => historyAbortRef.current?.abort(), []);

  useEffect(() => {
    const container = chatScrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (!selectedProjectId) return;
        if (!hasMoreHistory) return;
        if (isLoadingHistoryRef.current) return;
        void loadHistory({ projectId: selectedProjectId, cursor: historyCursor, mode: "prepend" });
      },
      {
        root: container,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreHistory, historyCursor, loadHistory, selectedProjectId]);

  const handleModelChange = (value: string) => {
    dispatch({ type: "update-last-model", modelId: value });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
    setStatusMessage(null);
  };

  const setInputValue = (value: string) => {
    dispatch({ type: "set-input", value });
  };

  const resetStreaming = useCallback(() => {
    dispatch({ type: "set-streaming", value: false });
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

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const selections = files.map((file) => ({
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${file.name}-${Date.now()}`,
        file,
      }));

      setPendingAttachments((previous) => [...previous, ...selections]);
      setStatusMessage(null);
    },
    []
  );

  const scrollChatToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = chatScrollRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      const target = chatScrollRef.current;
      if (!target) return;
      target.scrollTo({
        top: target.scrollHeight,
        behavior,
      });
    });
  }, []);

  const beginStreaming = useCallback(
    (turn: ChatTurn, streamUrl: string) => {
      activeTurnRef.current = turn.id;
      dispatch({ type: "append-turn", turn });
      skipAutoScrollRef.current = false;
      scrollChatToBottom("auto");

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
          scheduleTimeout();
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: {
              provider: getProviderFromModel(event.model),
              model: event.model,
              status: "streaming",
            },
          });
        },
        onDelta: (event) => {
          scheduleTimeout();
          dispatch({
            type: "append-answer-content",
            turnId: turn.id,
            delta: event.text_delta,
          });
          scrollChatToBottom("auto");
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
          scrollChatToBottom("smooth");
        },
        onError: (event) => {
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: { status: "error", errorMessage: event.message },
          });
          setStatusMessage(event.message);
          resetStreaming();
          scrollChatToBottom("smooth");
        },
        onComplete: () => {
          resetStreaming();
          scrollChatToBottom("smooth");
        },
      });
    },
    [handleStreamTimeout, resetStreaming, scrollChatToBottom]
  );

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
      dispatch({ type: "set-streaming", value: true });

      const modelId = options?.modelId ?? state.session.lastModelId;
      const attachments =
        options?.attachments !== undefined ? options.attachments : await serializeAttachments();

      if (!options?.attachments) {
        setPendingAttachments([]);
      }

      const payload = {
        sessionId: state.session.id,
        message: trimmed,
        model: modelId,
        projectId,
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
        const pendingTurn = createPendingTurn(turnId, trimmed, modelId, attachments, projectId);
        beginStreaming(pendingTurn, streamUrl);
        if (!options?.message) {
          setInputValue("");
        }
      } catch (error) {
        dispatch({ type: "set-streaming", value: false });
        const message = error instanceof Error ? error.message : "Unable to start chat turn.";
        setStatusMessage(message);
        if (!options?.message) {
          setInputValue(rawMessage);
        }
      }
    },
    [
      beginStreaming,
      serializeAttachments,
      state.inputValue,
      state.session.id,
      state.session.lastModelId,
      selectedProjectId,
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

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
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
    // Reset input so selecting the same file twice still triggers change
    event.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((previous) => previous.filter((item) => item.id !== id));
  };

  const showSendDisabled =
    state.isStreaming || !state.inputValue.trim() || isPreparingAttachments || !selectedProjectId;

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

  useEffect(() => {
    if (state.session.turns.length === 0) return;
    if (skipAutoScrollRef.current) {
      skipAutoScrollRef.current = false;
      return;
    }
    scrollChatToBottom(state.isStreaming ? "auto" : "smooth");
  }, [state.session.turns, state.isStreaming, scrollChatToBottom]);

  return (
    <div className="flex w-full flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">AI Analytics</h1>
        <p className="text-sm text-slate-500">
          Upload datasets, briefs, or research files and ask the model to analyze them with your commands.
        </p>
      </header>

      <section
        className={cn(
          "relative mb-2 flex min-h-0 flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 pt-3 pb-4 shadow-sm backdrop-blur transition xl:flex-1",
          isDragActive && "border-sky-300 ring-2 ring-inset ring-sky-300/60"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 bg-sky-50/80 text-sky-600">
            <UploadCloud className="h-8 w-8" aria-hidden="true" />
            <p className="text-sm font-medium">Drop files to attach</p>
            <p className="text-xs text-sky-500">They’ll be added to this analysis request.</p>
          </div>
        )}
        <div className="sticky top-0 z-10 -mx-2 mb-2 rounded-xl bg-white/95 px-2 py-2 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,14rem)] lg:items-start lg:gap-3">
            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="model" className="text-xs font-medium text-slate-700">
                Model
              </label>
              <Select value={state.session.lastModelId} onValueChange={handleModelChange}>
                <SelectTrigger id="model" aria-label="Select AI model" className="h-8 text-sm">
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor="project" className="text-xs font-medium text-slate-700">
                Project
              </label>
              <Select
                value={selectedProjectId ?? ""}
                onValueChange={handleProjectChange}
                disabled={projects.length === 0}
              >
                <SelectTrigger id="project" aria-label="Select project" className="h-8 text-sm">
                  <SelectValue
                    placeholder={projects.length === 0 ? "No projects available" : "Choose a project"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-500">
                {projects.length === 0
                  ? "Create a project first from the Projects section."
                  : "Every conversation will be tagged to this project."}
              </p>
            </div>
          </div>
        </div>



        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm">
          <div
            ref={chatScrollRef}
            className={cn(
              "flex-1 space-y-3 px-4 py-3 pr-4",
              hasTurns ? "overflow-y-auto" : "overflow-visible"
            )}
          >
            <div ref={topSentinelRef} aria-hidden="true" />
            {isLoadingHistory && hasMoreHistory ? (
              <div className="flex items-center justify-center py-2 text-xs text-slate-500">
                Loading previous messages…
              </div>
            ) : null}
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <button
                type="button"
                onClick={() => setShowTips((prev) => !prev)}
                className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <span>Pro tips</span>
                <span className="text-[11px] font-medium text-slate-400">{showTips ? "Hide" : "Show"}</span>
              </button>
              {showTips && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-sm font-semibold text-slate-700">Reference your files</p>
                    <p className="mt-1 text-xs text-slate-500">Mention uploads by filename so we can locate the right data.</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-sm font-semibold text-slate-700">Ask for structure</p>
                    <p className="mt-1 text-xs text-slate-500">Request summaries, action items, or comparisons to guide the response.</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-sm font-semibold text-slate-700">Iterate quickly</p>
                    <p className="mt-1 text-xs text-slate-500">Follow up with clarifying questions rather than starting fresh.</p>
                  </div>
                </div>
              )}
            </div>

            {!hasTurns ? <EmptyState onUploadClick={() => fileInputRef.current?.click()} /> : null}

            {hasTurns
              ? state.session.turns.map((turn) => {
                  const projectLabel = turn.projectId ? projectMap.get(turn.projectId)?.name : undefined;
                  return (
                    <ChatTurnView
                      key={turn.id}
                      turn={turn}
                      projectLabel={projectLabel}
                      onRetry={() => retryTurn(turn)}
                      onCopy={() => handleCopy(turn.answer.content)}
                    />
                  );
                })
              : null}
          </div>
          <div className="border-t border-slate-200 bg-slate-50/90 px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-1">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragCounter.current -= 1;
                  if (dragCounter.current === 0) {
                    setIsDragActive(false);
                  }
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragCounter.current += 1;
                  if (e.dataTransfer?.items?.length) {
                    setIsDragActive(true);
                  }
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragActive(false);
                  dragCounter.current = 0;
                  const files = Array.from(e.dataTransfer.files);
                  await handleFiles(files);
                }}
              >
                <ChatInput
                  value={state.inputValue}
                  onChange={setInputValue}
                  onKeyDown={onTextareaKeyDown}
                  onFilesSelected={handleFiles}
                  onFileRemove={removeFile}
                  isDragActive={isDragActive}
                  isDisabled={state.isStreaming}
                  selectedFiles={selectedFiles}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 rounded-full bg-slate-200/80 px-5 py-2.5 text-[11px] font-medium text-slate-600 shadow-sm">
                  <span>Enter to send</span>
                  <span className="text-slate-400">•</span>
                  <span>Shift + Enter for newline</span>
                  {isPreparingAttachments && (
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> Preparing files…
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={showSendDisabled}
                  aria-label="Send message"
                  className="inline-flex items-center gap-3 rounded-full bg-sky-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:bg-sky-300 disabled:text-white/80"
                >
                  {state.isStreaming ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Working...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send</span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] uppercase tracking-wide">⌘⤳</span>
                    </>
                  )}
                </Button>
              </div>
              {statusMessage ? (
                <p className="text-sm text-slate-600" role="status">
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const EmptyState = ({ onUploadClick }: { onUploadClick: () => void }) => (
  <button
    type="button"
    onClick={onUploadClick}
    className="mb-2 flex w-full flex-col items-center justify-center gap-2 self-stretch rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-4 text-center text-sm text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
  >
    <UploadCloud className="h-6 w-6 text-slate-400" aria-hidden="true" />
    <p className="text-sm font-semibold text-slate-700">Upload a file or ask for an insight.</p>
    <p className="text-xs text-slate-500">Attach briefs, datasets, or presentations to analyze.</p>
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/70 px-2.5 py-1 text-[11px] font-medium text-slate-600">
      <Paperclip className="h-3 w-3" aria-hidden="true" /> Click to upload
    </span>
  </button>
);

type ChatTurnViewProps = {
  turn: ChatTurn;
  projectLabel?: string;
  onCopy: () => void;
  onRetry: () => void;
};

const ChatTurnView = ({ turn, projectLabel, onCopy, onRetry }: ChatTurnViewProps) => {
  const isError = turn.answer.status === "error" || turn.answer.status === "timeout";
  const isStreaming = turn.answer.status === "streaming";
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl bg-sky-500 px-4 py-3 text-sm text-white shadow-sm">
          <p className="whitespace-pre-wrap break-words">{turn.userMessage}</p>
          {turn.attachments.length > 0 && (
            <AttachmentList attachments={turn.attachments} alignment="right" />
          )}
        </div>
      </div>
      <Card className="rounded-2xl border-slate-200/80 bg-white p-5 shadow-md dark:border-slate-800/60">
        <div className="space-y-4">
          <MarkdownPreview markdown={turn.answer.content} isStreaming={isStreaming} />
          {turn.attachments.length > 0 && (
            <AttachmentList attachments={turn.attachments} alignment="left" heading="Referenced files" compact />
          )}
          {isError && turn.answer.errorMessage && (
            <p className="text-sm text-rose-500">{turn.answer.errorMessage}</p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            {typeof turn.answer.latencyMs === "number" && (
              <Metric label="Latency" value={`${turn.answer.latencyMs} ms`} />
            )}
            {typeof turn.answer.tokensIn === "number" && typeof turn.answer.tokensOut === "number" && (
              <Metric label="Tokens" value={`${turn.answer.tokensIn} in / ${turn.answer.tokensOut} out`} />
            )}
            {typeof turn.answer.costCents === "number" && (
              <Metric label="Cost" value={formatCurrency(turn.answer.costCents)} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="gap-2 text-xs" onClick={onCopy} aria-label="Copy response">
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-xs"
              onClick={onRetry}
              disabled={isStreaming}
              aria-label="Retry with the same model"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AttachmentList = ({
  attachments,
  alignment,
  heading,
  compact = false,
}: {
  attachments: ChatAttachment[];
  alignment: "left" | "right";
  heading?: string;
  compact?: boolean;
}) => (
  <div className={cn("mt-3 space-y-2", alignment === "right" ? "text-right" : "text-left")}>
    {heading && <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{heading}</p>}
    <ul
      className={cn(
        "flex flex-wrap gap-2",
        alignment === "right" ? "justify-end" : "justify-start",
        compact ? "text-xs" : "text-sm"
      )}
    >
      {attachments.map((attachment) => {
        const hasDownload = Boolean(attachment.dataUrl);
        return (
          <li
            key={attachment.id}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600",
              compact && "px-2.5"
            )}
          >
            <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {hasDownload ? (
              <a
                href={attachment.dataUrl}
                download={attachment.name}
                className="max-w-[200px] truncate underline-offset-2 hover:underline"
              >
                {attachment.name}
              </a>
            ) : (
              <span className="max-w-[200px] truncate" title={attachment.name}>
                {attachment.name}
              </span>
            )}
            <span className="text-slate-400">{formatBytes(attachment.size)}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
    <span className="font-semibold text-slate-700">{label}:</span> {value}
  </span>
);

const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });

const MarkdownPreview = ({ markdown, isStreaming }: { markdown: string; isStreaming: boolean }) => {
  const nodes = useMemo(() => parseMarkdown(markdown), [markdown]);
  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed text-slate-700 [&_a]:text-sky-600 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        isStreaming && "opacity-80"
      )}
    >
      {nodes}
    </div>
  );
};

const parseMarkdown = (value: string) => {
  const elements: ReactNode[] = [];
  const lines = value.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] | null = null;
  let code: { language: string | null; content: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      elements.push(<p key={`p-${elements.length}`}>{renderInline(paragraph.join(" "))}</p>);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list && list.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5">
          {list.map((item, index) => (
            <li key={`li-${elements.length}-${index}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      list = null;
    }
  };

  const flushCode = () => {
    if (code) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100"
        >
          <code>{code.content.join("\n")}</code>
        </pre>
      );
      code = null;
    }
  };

  lines.forEach((line) => {
    if (code) {
      if (line.startsWith("```")) {
        flushCode();
      } else {
        code.content.push(line);
      }
      return;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      code = { language: line.slice(3).trim() || null, content: [] };
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith("#")) {
      flushParagraph();
      flushList();
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const content = line.replace(/^#+\s*/, "");
      elements.push(createHeading(level, content, elements.length));
      return;
    }

    if (line.trim().startsWith("- ")) {
      flushParagraph();
      list = list ?? [];
      list.push(line.trim().slice(2));
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCode();
  return elements;
};

const createHeading = (level: number, content: string, index: number) => {
  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag key={`heading-${index}`} className="font-semibold text-slate-800">
      {renderInline(content)}
    </HeadingTag>
  );
};

const renderInline = (value: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`strong-${nodes.length}`}>{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`em-${nodes.length}`}>{renderInline(token.slice(1, -1))}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={`code-${nodes.length}`} className="rounded bg-slate-200 px-1 py-0.5 text-xs text-slate-900">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const [, text, url] = token.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      if (text && url) {
        nodes.push(
          <a key={`link-${nodes.length}`} href={url} target="_blank" rel="noreferrer" className="text-sky-600 underline">
            {text}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
};
