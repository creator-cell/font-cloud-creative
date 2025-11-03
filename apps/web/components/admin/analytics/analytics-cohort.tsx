"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnalyticsCohortResponse } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTokens } from "@/lib/formatters";

type CohortFilters = {
  start: string;
  weeks: number;
};

type AnalyticsCohortViewProps = {
  cohort: AnalyticsCohortResponse;
  initialFilters: CohortFilters;
};

const buildKey = (cohortStartISO: string, weekIndex: number) => `${cohortStartISO}::${weekIndex}`;

export const AnalyticsCohortView = ({ cohort, initialFilters }: AnalyticsCohortViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.start, initialFilters.weeks]);

  const cohortsByKey = useMemo(() => {
    const map = new Map<string, { tokens: number; users: number }>();
    cohort.cohorts.forEach((entry) => {
      map.set(buildKey(entry.cohortStartISO, entry.weekIndex), {
        tokens: entry.tokens,
        users: entry.users
      });
    });
    return map;
  }, [cohort.cohorts]);

  const retentionByKey = useMemo(() => {
    const map = new Map<string, number>();
    cohort.retention.forEach((entry) => {
      map.set(buildKey(entry.cohortStartISO, entry.weekIndex), entry.activePct);
    });
    return map;
  }, [cohort.retention]);

  const cohortSizes = useMemo(() => {
    const map = new Map<string, number>();
    cohort.cohortSizes.forEach((entry) => {
      map.set(entry.cohortStartISO, entry.users);
    });
    return map;
  }, [cohort.cohortSizes]);

  const cohortKeys = useMemo(() => {
    const keys = Array.from(cohortSizes.keys()).sort();
    return keys;
  }, [cohortSizes]);

  const maxTokens = useMemo(() => {
    let max = 0;
    cohort.cohorts.forEach((entry) => {
      if (entry.tokens > max) max = entry.tokens;
    });
    return max;
  }, [cohort.cohorts]);

  const updateFilters = (patch: Partial<CohortFilters>) => {
    const next = { ...filters, ...patch } as CohortFilters;
    setFilters(next);
    const params = new URLSearchParams();
    params.set("start", next.start);
    params.set("weeks", String(next.weeks));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const weekIndices = Array.from({ length: filters.weeks }, (_, index) => index);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="cohort-start">
              Cohort start week
            </label>
            <Input
              id="cohort-start"
              type="date"
              value={filters.start}
              onChange={(event) => updateFilters({ start: event.target.value })}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="cohort-weeks">
              Weeks
            </label>
            <Input
              id="cohort-weeks"
              type="number"
              min={1}
              max={26}
              value={filters.weeks}
              onChange={(event) => updateFilters({ weeks: Number(event.target.value) })}
              disabled={isPending}
            />
          </div>
        </div>
        <div className="text-sm text-slate-500">
          Each cell shows tokens in the given week, background intensity reflects retention (% of cohort active).
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cohort activity</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {cohortKeys.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No cohorts found for this window.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cohort (signup week)
                  </th>
                  {weekIndices.map((weekIndex) => (
                    <th key={`week-${weekIndex}`} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      W{weekIndex}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortKeys.map((cohortKey) => (
                  <tr key={cohortKey}>
                    <th className="sticky left-0 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      {new Date(cohortKey).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      <div className="text-[11px] font-normal text-slate-400">
                        {formatTokens(cohortSizes.get(cohortKey) ?? 0)} users
                      </div>
                    </th>
                    {weekIndices.map((weekIndex) => {
                      const entry = cohortsByKey.get(buildKey(cohortKey, weekIndex));
                      const retention = retentionByKey.get(buildKey(cohortKey, weekIndex)) ?? 0;
                      const ratio = maxTokens > 0 ? (entry?.tokens ?? 0) / maxTokens : 0;
                      const intensity = Math.max(retention, ratio);
                      return (
                        <td
                          key={`${cohortKey}-${weekIndex}`}
                          className="px-3 py-3 text-center text-xs"
                          style={{
                            backgroundColor: `rgba(14, 165, 233, ${Math.min(intensity + 0.05, 0.85)})`,
                            color: intensity > 0.45 ? "#fff" : "#0f172a"
                          }}
                        >
                          <div className="font-semibold">{formatTokens(entry?.tokens ?? 0)}</div>
                          <div className="text-[11px] opacity-80">{Math.round((retention ?? 0) * 100)}%</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="font-semibold uppercase tracking-wide">Legend</span>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-sky-100" />
          <span>&lt; 20% retention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-sky-400" />
          <span>20-50% retention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-sky-600" />
          <span>&gt; 50% retention</span>
        </div>
      </div>
    </div>
  );
};
