import Link from "next/link";
import { notFound } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminUsage, type AdminUsageRecord } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LedgerExportButton } from "@/components/admin/ledger-export-button";

const usageStatusOptions = ["", "completed", "failed"] as const;
const usageSortFields = new Set(["createdAt", "totalTokens"]);

const getParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

const buildUrl = (
  baseParams: Record<string, string | number | undefined>,
  overrides: Record<string, string | number | undefined>
) => {
  const params = new URLSearchParams();
  const merged = { ...baseParams, ...overrides };
  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === null) return;
    params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

const formatNumber = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: fractionDigits }).format(value);

const formatCurrency = (valueCents: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(valueCents / 100);

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function AdminUsagePage({ searchParams }: PageProps) {
  const session = await requireServerRole(["owner", "admin"]);
  if (!session.apiToken) {
    notFound();
  }

  const filters = {
    userId: getParam(searchParams.userId).trim(),
    provider: getParam(searchParams.provider).trim(),
    model: getParam(searchParams.model).trim(),
    status: getParam(searchParams.status),
    from: getParam(searchParams.from),
    to: getParam(searchParams.to)
  } as const;

  const page = Number(getParam(searchParams.page) || "1");
  const limit = Number(getParam(searchParams.limit) || "50");
  const sort = usageSortFields.has(getParam(searchParams.sort))
    ? (getParam(searchParams.sort) as "createdAt" | "totalTokens")
    : "createdAt";
  const direction = getParam(searchParams.direction) === "asc" ? "asc" : "desc";
  const displayCurrency = (getParam(searchParams.displayCurrency) as "USD" | "INR" | "SAR") || "INR";

  const data = await fetchAdminUsage(session.apiToken, {
    ...filters,
    page,
    limit,
    sort,
    direction,
    displayCurrency
  });

  const baseParams = { ...filters, sort, direction, limit, displayCurrency };
  const totalPages = Math.max(1, Math.ceil(data.total / Math.max(limit, 1)));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const toggleSort = (field: "createdAt" | "totalTokens") => {
    const isActive = sort === field;
    const nextDirection = isActive && direction === "desc" ? "asc" : "desc";
    return `/admin/usage${buildUrl(baseParams, { sort: field, direction: nextDirection, page: 1 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Filtered Total Tokens</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(data.aggregates.totalTokens ?? 0)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Average Latency</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(data.aggregates.avgLatencyMs ?? 0, 0)} ms
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Total Cost ({displayCurrency})</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-white">
            {formatCurrency(data.aggregates.totalCostCents ?? 0, displayCurrency)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Filters</CardTitle>
          <LedgerExportButton token={session.apiToken} params={baseParams} endpoint="usage" />
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" method="get">
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-user" className="text-xs font-semibold uppercase text-slate-500">
                User ID
              </label>
              <Input id="usage-user" name="userId" defaultValue={filters.userId} placeholder="User id" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-provider" className="text-xs font-semibold uppercase text-slate-500">
                Provider
              </label>
              <Input id="usage-provider" name="provider" defaultValue={filters.provider} placeholder="openai" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-model" className="text-xs font-semibold uppercase text-slate-500">
                Model
              </label>
              <Input id="usage-model" name="model" defaultValue={filters.model} placeholder="gpt-4o" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-status" className="text-xs font-semibold uppercase text-slate-500">
                Status
              </label>
              <select
                id="usage-status"
                name="status"
                defaultValue={filters.status}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                {usageStatusOptions.map((value) => (
                  <option key={value || "all"} value={value}>
                    {value ? value : "All"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-display-currency" className="text-xs font-semibold uppercase text-slate-500">
                Display Currency
              </label>
              <select
                id="usage-display-currency"
                name="displayCurrency"
                defaultValue={displayCurrency}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                {["INR", "USD", "SAR"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-from" className="text-xs font-semibold uppercase text-slate-500">
                From
              </label>
              <Input id="usage-from" type="date" name="from" defaultValue={filters.from} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="usage-to" className="text-xs font-semibold uppercase text-slate-500">
                To
              </label>
              <Input id="usage-to" type="date" name="to" defaultValue={filters.to} />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">Apply</Button>
              <Link href="/admin/usage" className="text-sm text-slate-500 hover:text-slate-700">
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <Link href={toggleSort("createdAt")} className="flex items-center gap-1">
                  Date
                  <span className="text-xs text-slate-400">{sort === "createdAt" ? (direction === "desc" ? "▼" : "▲") : ""}</span>
                </Link>
              </th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Provider / Model</th>
              <th className="px-4 py-3 text-right">In</th>
              <th className="px-4 py-3 text-right">Out</th>
              <th className="px-4 py-3 text-right">
                <Link href={toggleSort("totalTokens")} className="flex items-center justify-end gap-1">
                  Total
                  <span className="text-xs text-slate-400">{sort === "totalTokens" ? (direction === "desc" ? "▼" : "▲") : ""}</span>
                </Link>
              </th>
              <th className="px-4 py-3 text-right">Latency</th>
              <th className="px-4 py-3 text-right">Cost ({displayCurrency})</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
          {data.items.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                No usage records match the current filters.
              </td>
            </tr>
          ) : (
            data.items.map((usage: AdminUsageRecord) => (
              <tr key={usage.id} className="bg-white">
                <td className="px-4 py-3 text-slate-600">{new Date(usage.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <Link href={`/admin/wallets?userId=${usage.userId}`} className="font-medium text-sky-600">
                      {usage.userEmail || usage.userId}
                    </Link>
                    <span className="text-xs text-slate-400">{usage.userId}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {usage.provider || "—"}
                  {usage.model ? ` / ${usage.model}` : ""}
                  {(usage.conversationId || usage.turnId) && (
                    <div className="mt-1 text-xs text-slate-400">
                      {usage.conversationId && <span>Conv: {usage.conversationId}</span>}
                      {usage.turnId && <span className="ml-2">Turn: {usage.turnId}</span>}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatNumber(usage.tokensIn)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatNumber(usage.tokensOut)}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatNumber(usage.totalTokens)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatNumber(usage.latencyMs)} ms</td>
                <td className="px-4 py-3 text-right text-slate-900">
                  {formatCurrency(usage.displayCostCents, displayCurrency)}
                  {usage.currency !== displayCurrency && (
                    <div className="text-xs text-slate-400">
                      {formatCurrency(usage.finalCostCents, usage.currency)} original
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
                      usage.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {usage.status}
                  </span>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {currentPage} of {totalPages} • {data.total} records
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/usage${buildUrl(baseParams, {
              page: Math.max(1, currentPage - 1)
            })}`}
            className={`rounded-md border px-3 py-2 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Previous
          </Link>
          <Link
            href={`/admin/usage${buildUrl(baseParams, {
              page: Math.min(totalPages, currentPage + 1)
            })}`}
            className={`rounded-md border px-3 py-2 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
