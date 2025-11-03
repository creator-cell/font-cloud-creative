"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatAttachment } from "@/src/lib/chat/types";
import { formatBytes } from "./utils";

type AttachmentListProps = {
  attachments: ChatAttachment[];
  alignment: "left" | "right";
  heading?: string;
  compact?: boolean;
};

export const AttachmentList = ({ attachments, alignment, heading, compact = false }: AttachmentListProps) => (
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
