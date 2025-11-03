"use client";

import { FileText, X } from "lucide-react";
import { formatBytes } from "./utils";

export type PendingAttachment = {
  id: string;
  file: File;
};

type PendingAttachmentsProps = {
  attachments: PendingAttachment[];
  onRemove: (id: string) => void;
};

export const PendingAttachments = ({ attachments, onRemove }: PendingAttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Files to analyze</p>
      <ul className="mt-2 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
        {attachments.map(({ id, file }) => (
          <li
            key={id}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span className="max-w-[160px] truncate" title={file.name}>
              {file.name}
            </span>
            <span className="text-slate-400">{formatBytes(file.size)}</span>
            <button
              type="button"
              className="ml-0.5 rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              onClick={() => onRemove(id)}
              aria-label={`Remove ${file.name}`}
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-slate-400">
        Files up to 2&nbsp;MB are shared inline. Larger files are referenced by name and size.
      </p>
    </div>
  );
};
