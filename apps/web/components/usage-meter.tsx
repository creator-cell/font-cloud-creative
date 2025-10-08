import { Badge } from "@/components/ui/badge";

interface UsageProps {
  tokensIn: number;
  tokensOut: number;
  quota: number;
  warnings?: string[];
}

export const UsageMeter = ({ tokensIn, tokensOut, quota, warnings = [] }: UsageProps) => {
  const total = tokensIn + tokensOut;
  const percent = Math.min(100, Math.round((total / quota) * 100));
  const barColor = percent > 90 ? "bg-rose-500" : percent > 75 ? "bg-amber-400" : "bg-emerald-500";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Monthly usage</h3>
        <Badge tone={percent > 90 ? "warning" : "success"}>{percent}%</Badge>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {total.toLocaleString()} / {quota.toLocaleString()} tokens
      </p>
      {warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-amber-600 dark:text-amber-300">
          {warnings.map((warning) => (
            <li key={warning}>⚠ {warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
