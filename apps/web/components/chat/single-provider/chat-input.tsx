"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  disabled: boolean;
  isPreparingAttachments: boolean;
  statusMessage: string | null;
};

export const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  isStreaming,
  disabled,
  isPreparingAttachments,
  statusMessage,
}: ChatInputProps) => (
  <div className="border-t border-slate-200 bg-slate-50/90 px-4 py-6 sm:px-6">
    <div className="flex flex-col gap-1">
      <Textarea
        rows={2}
        value={value}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the analysis you want. Reference any uploaded files by name."
        aria-label="Chat message"
      />
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
          onClick={onSubmit}
          disabled={disabled}
          aria-label="Send message"
          className="inline-flex items-center gap-3 rounded-full bg-sky-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:bg-sky-300 disabled:text-white/80"
        >
          {isStreaming ? (
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
);
