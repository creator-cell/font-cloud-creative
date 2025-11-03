"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AnalyticsSummaryResponse,
  AnalyticsTimeseriesResponse,
  AnalyticsDistributionResponse,
  buildAnalyticsExportUrl
} from "@/lib/api/admin";
import { KpiCard } from "@/components/admin/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatInr, formatLatency, formatTokens } from "@/lib/formatters";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

type Filters = {
  from: string;
  to: string;
  interval: "day" | "week" | "month";
  tz: string;
};

type AnalyticsOverviewProps = {
  summary: AnalyticsSummaryResponse;
  timeseries: AnalyticsTimeseriesResponse;
  distribution: AnalyticsDistributionResponse;
  initialFilters: Filters;
};

const COLORS = ["#0284c7", "#22c55e", "#f97316", "#8b5cf6", "#ec4899", "#0ea5e9"];

const formatLabel = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit"
  }).format(new Date(value));

export const AnalyticsOverview = ({ summary, timeseries, distribution, initialFilters }: AnalyticsOverviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.from, initialFilters.to, initialFilters.interval, initialFilters.tz]);

  const timeseriesData = useMemo(
    () =>
      timeseries.labels.map((label, index) => ({
        label,
        tokens: timeseries.tokens[index] ?? 0,
        cost: (timeseries.costCents[index] ?? 0) / 100,
        turns: timeseries.turns[index] ?? 0,
        avgLatency: timeseries.avgLatencyMs[index] ?? 0
      })),
    [timeseries]
  );

  const onFilterChange = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch } as Filters;
    setFilters(next);
    const params = new URLSearchParams();
    params.set("from", next.from);
    params.set("to", next.to);
    params.set("interval", next.interval);
    params.set("tz", next.tz);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const exportHref = buildAnalyticsExportUrl({
    type: "timeseries",
    from: filters.from,
    to: filters.to,
    interval: filters.interval,
    tz: filters.tz
  });

  const distributionProviderData = distribution.byProvider.filter((entry) => entry.totalTokens > 0);
  const distributionPlanData = distribution.byPlan.filter((entry) => entry.totalTokens > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="from">
              From
            </label>
            <Input
              id="from"
              type="date"
              value={filters.from}
              max={filters.to}
              onChange={(event) => onFilterChange({ from: event.target.value })}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="to">
              To
            </label>
            <Input
              id="to"
              type="date"
              value={filters.to}
              min={filters.from}
              onChange={(event) => onFilterChange({ to: event.target.value })}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="interval">
              Interval
            </label>
            <Select
              value={filters.interval}
              onValueChange={(value: "day" | "week" | "month") => onFilterChange({ interval: value })}
              disabled={isPending}
            >
              <SelectTrigger id="interval">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="timezone">
              Timezone
            </label>
            <Input
              id="timezone"
              value={filters.tz}
              onChange={(event) => onFilterChange({ tz: event.target.value })}
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPending}>
            <a href={exportHref}>Download Timeseries CSV</a>
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-5", isPending && "opacity-60")}> 
        <KpiCard
          title="Total Tokens"
          value={formatTokens(summary.totalTokens)}
          subtitle={`${filters.from} → ${filters.to}`}
        />
        <KpiCard
          title="Total Cost"
          value={formatInr(summary.totalCostCents)}
          subtitle="INR"
        />
        <KpiCard title="Active Users" value={formatTokens(summary.activeUsers)} subtitle="Distinct" />
        <KpiCard title="Turns" value={formatTokens(summary.turns)} subtitle="Token usage records" />
        <KpiCard title="Avg Latency" value={formatLatency(summary.avgLatencyMs)} subtitle="Across turns" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-[360px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tokens over time</CardTitle>
              <p className="text-xs text-slate-500">Total tokens consumed</p>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            {timeseriesData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No usage in this range.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseriesData} margin={{ left: 12, right: 12 }}>
                  <defs>
                    <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tickFormatter={formatLabel} minTickGap={24} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => formatTokens(value as number)} width={80} />
                  <Tooltip
                    formatter={(value: number) => formatTokens(value)}
                    labelFormatter={(label) => formatLabel(label)}
                  />
                  <Area type="monotone" dataKey="tokens" stroke="#0284c7" strokeWidth={2} fill="url(#tokensGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="h-[360px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Cost over time</CardTitle>
              <p className="text-xs text-slate-500">Final cost (₹)</p>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            {timeseriesData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No cost recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseriesData} margin={{ left: 12, right: 12 }}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tickFormatter={formatLabel} minTickGap={24} stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(value) => formatInr((value as number) * 100, 0)}
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: number) => formatInr(value * 100)}
                    labelFormatter={(label) => formatLabel(label)}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#22c55e" strokeWidth={2} fill="url(#costGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-[360px]">
        <CardHeader>
          <CardTitle>Average latency</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          {timeseriesData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No latency data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseriesData} margin={{ left: 12, right: 12 }}>
                <XAxis dataKey="label" tickFormatter={formatLabel} minTickGap={24} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${Math.round(value as number)} ms`} width={80} />
                <Tooltip
                  formatter={(value: number) => formatLatency(value)}
                  labelFormatter={(label) => formatLabel(label)}
                />
                <Line type="monotone" dataKey="avgLatency" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-[360px]">
          <CardHeader>
            <CardTitle>Tokens by provider</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[280px] flex-col items-center justify-center">
            {distributionProviderData.length === 0 ? (
              <p className="text-sm text-slate-500">No provider activity.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionProviderData}
                    dataKey="totalTokens"
                    nameKey="provider"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {distributionProviderData.map((entry, index) => (
                      <Cell key={entry.provider} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name, props) => [formatTokens(value), props.payload?.provider ?? name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="h-[360px]">
          <CardHeader>
            <CardTitle>Tokens by plan</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[280px] flex-col items-center justify-center">
            {distributionPlanData.length === 0 ? (
              <p className="text-sm text-slate-500">No token usage recorded by plan.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionPlanData}
                    dataKey="totalTokens"
                    nameKey="planKey"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {distributionPlanData.map((entry, index) => (
                      <Cell key={entry.planKey} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name, props) => [formatTokens(value), props.payload?.planKey ?? name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

