"use client";

import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChatTurn } from "@/src/lib/chat/types";
import { AttachmentList } from "./attachment-list";
import { MarkdownPreview } from "./markdown-preview";
import { formatCurrency } from "./utils";

type ChatTurnViewProps = {
  turn: ChatTurn;
  projectLabel?: string;
  onCopy: () => void;
  onRetry: () => void;
};

export const ChatTurnView = ({ turn, projectLabel, onCopy, onRetry }: ChatTurnViewProps) => {
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
            <AttachmentList
              attachments={turn.attachments}
              alignment="left"
              heading="Referenced files"
              compact
            />
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

const Metric = ({ label, value }: { label: string; value: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
    <span className="font-semibold text-slate-700">{label}:</span> {value}
  </span>
);
