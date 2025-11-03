"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AnalyticsTopUsersResponse,
  AnalyticsTopModelsResponse,
  buildAnalyticsExportUrl
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr, formatLatency, formatTokens } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Filters = {
  from: string;
  to: string;
  limit: number;
  tz: string;
};

type SortConfig<T extends string> = {
  column: T;
  direction: "asc" | "desc";
};

type AnalyticsTopProps = {
  usersResponse: AnalyticsTopUsersResponse;
  modelsResponse: AnalyticsTopModelsResponse;
  initialFilters: Filters;
};

type UserColumns = "email" | "totalTokens" | "totalCostCents" | "turns" | "avgLatencyMs";
type ModelColumns = "model" | "provider" | "totalTokens" | "totalCostCents" | "turns" | "avgLatencyMs";

export const AnalyticsTop = ({ usersResponse, modelsResponse, initialFilters }: AnalyticsTopProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"users" | "models">("users");
  const [userSort, setUserSort] = useState<SortConfig<UserColumns>>({ column: "totalTokens", direction: "desc" });
  const [modelSort, setModelSort] = useState<SortConfig<ModelColumns>>({ column: "totalTokens", direction: "desc" });

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.from, initialFilters.to, initialFilters.limit, initialFilters.tz]);

  const updateFilters = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch } as Filters;
    setFilters(next);
    const params = new URLSearchParams();
    params.set("from", next.from);
    params.set("to", next.to);
    params.set("limit", String(next.limit));
    params.set("tz", next.tz);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const sortedUsers = useMemo(() => {
    const rows = [...usersResponse.users];
    rows.sort((a, b) => {
      const dir = userSort.direction === "asc" ? 1 : -1;
      const av = a[userSort.column];
      const bv = b[userSort.column];
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return rows;
  }, [usersResponse.users, userSort]);

  const sortedModels = useMemo(() => {
    const rows = [...modelsResponse.models];
    rows.sort((a, b) => {
      const dir = modelSort.direction === "asc" ? 1 : -1;
      const av = a[modelSort.column];
      const bv = b[modelSort.column];
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return rows;
  }, [modelsResponse.models, modelSort]);

  const toggleUserSort = (column: UserColumns) => {
    setUserSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "desc" ? "asc" : "desc"
    }));
  };

  const toggleModelSort = (column: ModelColumns) => {
    setModelSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "desc" ? "asc" : "desc"
    }));
  };

  const usersExport = buildAnalyticsExportUrl({
    type: "users",
    from: filters.from,
    to: filters.to,
    limit: filters.limit,
    tz: filters.tz
  });

  const modelsExport = buildAnalyticsExportUrl({
    type: "models",
    from: filters.from,
    to: filters.to,
    limit: filters.limit,
    tz: filters.tz
  });

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
              onChange={(event) => updateFilters({ from: event.target.value })}
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
              onChange={(event) => updateFilters({ to: event.target.value })}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="limit">
              Limit
            </label>
            <Select
              value={String(filters.limit)}
              onValueChange={(value) => updateFilters({ limit: Number(value) })}
              disabled={isPending}
            >
              <SelectTrigger id="limit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[20, 50, 100, 200].map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    Top {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="tz">
              Timezone
            </label>
            <Input
              id="tz"
              value={filters.tz}
              onChange={(event) => updateFilters({ tz: event.target.value })}
              disabled={isPending}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPending}>
            <a href={activeTab === "users" ? usersExport : modelsExport}>
              Download {activeTab === "users" ? "Top Users" : "Top Models"} CSV
            </a>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === "users" ? "primary" : "secondary"}
          onClick={() => setActiveTab("users")}
          className={cn("rounded-full px-4", activeTab === "users" ? "bg-sky-500 text-white" : "")}
        >
          Top Users
        </Button>
        <Button
          variant={activeTab === "models" ? "primary" : "secondary"}
          onClick={() => setActiveTab("models")}
          className={cn("rounded-full px-4", activeTab === "models" ? "bg-sky-500 text-white" : "")}
        >
          Top Models
        </Button>
      </div>

      {activeTab === "users" ? (
        <Card>
          <CardHeader>
            <CardTitle>Top users by tokens</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleUserSort("totalTokens")}>
                    Tokens
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleUserSort("totalCostCents")}>
                    Cost (₹)
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleUserSort("turns")}>
                    Turns
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleUserSort("avgLatencyMs")}>
                    Avg Latency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                      No users found in this range.
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{user.email || user.userId}</td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">
                        {formatTokens(user.totalTokens)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">
                        {formatInr(user.totalCostCents)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">{formatTokens(user.turns)}</td>
                      <td className="px-3 py-2 text-right text-slate-500">{formatLatency(user.avgLatencyMs)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top models by tokens</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Model</th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleModelSort("totalTokens")}>
                    Tokens
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleModelSort("totalCostCents")}>
                    Cost (₹)
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleModelSort("turns")}>
                    Turns
                  </th>
                  <th className="px-3 py-2 cursor-pointer" onClick={() => toggleModelSort("avgLatencyMs")}>
                    Avg Latency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedModels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                      No models found in this range.
                    </td>
                  </tr>
                ) : (
                  sortedModels.map((row) => (
                    <tr key={`${row.provider}-${row.model}`} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700 capitalize">{row.provider || "unknown"}</td>
                      <td className="px-3 py-2 text-slate-700">{row.model || "—"}</td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">
                        {formatTokens(row.totalTokens)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">{formatInr(row.totalCostCents)}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{formatTokens(row.turns)}</td>
                      <td className="px-3 py-2 text-right text-slate-500">{formatLatency(row.avgLatencyMs)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

