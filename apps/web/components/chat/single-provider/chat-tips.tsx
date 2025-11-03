"use client";

export const ChatTips = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      <span>Pro tips</span>
      <span className="text-[11px] font-medium text-slate-400">{show ? "Hide" : "Show"}</span>
    </button>
    {show && (
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <TipCard title="Reference your files" description="Mention uploads by filename so we can locate the right data." />
        <TipCard title="Ask for structure" description="Request summaries, action items, or comparisons to guide the response." />
        <TipCard title="Iterate quickly" description="Follow up with clarifying questions rather than starting fresh." />
      </div>
    )}
  </div>
);

const TipCard = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-xl bg-white/70 p-4">
    <p className="text-sm font-semibold text-slate-700">{title}</p>
    <p className="mt-1 text-xs text-slate-500">{description}</p>
  </div>
);
