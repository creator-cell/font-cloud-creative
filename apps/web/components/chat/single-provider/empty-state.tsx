"use client";

import { Paperclip, UploadCloud } from "lucide-react";

export const EmptyState = ({ onUploadClick }: { onUploadClick: () => void }) => (
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
