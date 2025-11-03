"use client";
import type { ProjectSummary } from "@/lib/api/endpoints";
import type { ChatTurn } from "@/src/lib/chat/types";
import { cn } from "@/lib/utils";
import { ChatTips } from "./chat-tips";
import { EmptyState } from "./empty-state";
import { ChatTurnView } from "./chat-turn-view";

type ChatTranscriptProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  hasTurns: boolean;
  showTips: boolean;
  onToggleTips: () => void;
  onUploadClick: () => void;
  turns: ChatTurn[];
  projectMap: Map<string, ProjectSummary>;
  onRetry: (turn: ChatTurn) => void;
  onCopy: (turn: ChatTurn) => void;
};

export const ChatTranscript = ({
  containerRef,
  hasTurns,
  showTips,
  onToggleTips,
  onUploadClick,
  turns,
  projectMap,
  onRetry,
  onCopy,
}: ChatTranscriptProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm">
      <div ref={containerRef} className={cn("flex-1 space-y-3 px-4 py-3 pr-4", hasTurns ? "overflow-y-auto" : "overflow-visible")}>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
          <ChatTips show={showTips} onToggle={onToggleTips} />
        </div>

        {!hasTurns ? <EmptyState onUploadClick={onUploadClick} /> : null}

        {hasTurns
          ? turns.map((turn) => {
              const projectLabel = turn.projectId ? projectMap.get(turn.projectId)?.name : undefined;
              return (
                <ChatTurnView
                  key={turn.id}
                  turn={turn}
                  projectLabel={projectLabel}
                  onRetry={() => onRetry(turn)}
                  onCopy={() => onCopy(turn)}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
