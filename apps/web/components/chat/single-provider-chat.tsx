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
import {
  PROVIDER_MODELS,
  getProviderFromModel,
  type ChatAttachment,
  type ChatTurn,
} from "@/src/lib/chat/types";
import { chatReducer, createInitialState, createPendingTurn } from "@/src/lib/chat/state";
import { createChatTurn, openChatStream } from "@/src/lib/chat/api";
import { cn } from "@/lib/utils";

const STREAM_TIMEOUT_MS = 45_000;
const STORAGE_KEY = "frontcloud.single-chat.model";
const MAX_INLINE_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

type StreamControllers = {
  source: EventSource | null;
  timeout: number | null;
};

type PendingAttachment = {
  id: string;
  file: File;
};

export const SingleProviderChat = () => {
  const initialModel = useMemo(() => {
    if (typeof window === "undefined") return PROVIDER_MODELS[0]?.id ?? "openai:gpt-4.1-mini";
    return window.localStorage.getItem(STORAGE_KEY) ?? PROVIDER_MODELS[0]?.id ?? "openai:gpt-4.1-mini";
  }, []);

  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `session-${Date.now()}`;
  }, []);

  const [state, dispatch] = useReducer(chatReducer, createInitialState(sessionId, initialModel));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isPreparingAttachments, setIsPreparingAttachments] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const controllersRef = useRef<StreamControllers>({ source: null, timeout: null });
  const activeTurnRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, state.session.lastModelId);
  }, [state.session.lastModelId]);

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

  const handleModelChange = (value: string) => {
    dispatch({ type: "update-last-model", modelId: value });
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

  const beginStreaming = useCallback(
    (turn: ChatTurn, streamUrl: string) => {
      activeTurnRef.current = turn.id;
      dispatch({ type: "append-turn", turn });

      controllersRef.current.timeout = window.setTimeout(() => handleStreamTimeout(turn.id), STREAM_TIMEOUT_MS);

      controllersRef.current.source = openChatStream(streamUrl, {
        onStart: (event) => {
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
          dispatch({
            type: "update-answer",
            turnId: turn.id,
            patch: { status: "error", errorMessage: event.message },
          });
          setStatusMessage(event.message);
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

  const sendMessage = useCallback(
    async (options?: { message?: string; modelId?: string; attachments?: ChatAttachment[] }) => {
      const rawMessage = options?.message ?? state.inputValue;
      const trimmed = rawMessage.trim();
      if (!trimmed) return;

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
        const pendingTurn = createPendingTurn(turnId, trimmed, modelId, attachments);
        beginStreaming(pendingTurn, streamUrl ?? `/api/chat/stream?turnId=${turnId}`);
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
    ]
  );

  const retryTurn = (turn: ChatTurn) => {
    if (state.isStreaming) return;
    void sendMessage({ message: turn.userMessage, modelId: turn.answer.model, attachments: turn.attachments });
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

  const showSendDisabled = state.isStreaming || !state.inputValue.trim() || isPreparingAttachments;

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

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">AI Analytics Chat</h1>
        <p className="text-sm text-slate-500">
          Upload datasets, briefs, or research files and ask the model to analyze them with your commands.
        </p>
      </header>

      <section
        className={cn(
          "relative flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur transition",
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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex w-full flex-col gap-2 lg:max-w-xs">
            <label htmlFor="model" className="text-sm font-medium text-slate-700">
              Model
            </label>
            <Select value={state.session.lastModelId} onValueChange={handleModelChange}>
              <SelectTrigger id="model" aria-label="Select AI model">
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

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={onFileInputChange}
              aria-label="Upload reference files"
            />
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload files for analysis"
            >
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              Attach files
            </Button>
            {pendingAttachments.length > 0 && (
              <span className="text-xs font-medium text-slate-500">
                {pendingAttachments.length} file{pendingAttachments.length > 1 ? "s" : ""} ready
              </span>
            )}
          </div>
        </div>

        {pendingAttachments.length > 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Files to analyze</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pendingAttachments.map(({ id, file }) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                >
                  <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span className="max-w-[200px] truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-slate-400">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    className="ml-1 rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    onClick={() => removeAttachment(id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-400">
              Files up to 2&nbsp;MB are shared inline. Larger files are referenced by name and size.
            </p>
          </div>
        )}

        <div className="flex min-h-[380px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex-1 space-y-6 overflow-y-auto p-6 pr-4">
            {state.session.turns.length === 0 ? (
              <EmptyState />
            ) : (
              state.session.turns.map((turn) => (
                <ChatTurnView
                  key={turn.id}
                  turn={turn}
                  onRetry={() => retryTurn(turn)}
                  onCopy={() => handleCopy(turn.answer.content)}
                />
              ))
            )}
          </div>
          <div className="border-t border-slate-200 bg-slate-50/80 p-4">
            <Textarea
              rows={3}
              value={state.inputValue}
              onKeyDown={onTextareaKeyDown}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Describe the analysis you want. Reference any uploaded files by name."
              aria-label="Chat message"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Enter to send • Shift + Enter for newline {isPreparingAttachments ? "• Preparing files…" : ""}
              </p>
              <Button
                type="button"
                onClick={() => void sendMessage()}
                disabled={showSendDisabled}
                aria-label="Send message"
                className="rounded-full bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-400 disabled:bg-sky-300 disabled:text-white/80"
              >
                {state.isStreaming ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Working...</span>
                  </span>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
            {statusMessage && (
              <p className="mt-2 text-sm text-slate-600" role="status">
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
    <UploadCloud className="h-10 w-10 text-slate-300" aria-hidden="true" />
    <div>
      <p className="font-medium text-slate-600">Start by adding files or a prompt</p>
      <p className="text-sm">
        Upload spreadsheets, PDFs, or briefs so the model can run analytics tailored to your request.
      </p>
    </div>
  </div>
);

type ChatTurnViewProps = {
  turn: ChatTurn;
  onCopy: () => void;
  onRetry: () => void;
};

const ChatTurnView = ({ turn, onCopy, onRetry }: ChatTurnViewProps) => {
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
            {turn.answer.finishReason && <Metric label="Finish" value={turn.answer.finishReason} />}
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
