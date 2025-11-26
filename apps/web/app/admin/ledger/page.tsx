import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminLedger, type AdminLedgerRecord } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LedgerExportButton } from "@/components/admin/ledger-export-button";

const getParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

const ledgerTypes = ["", "grant", "spend", "hold", "hold_release", "refund", "adjustment"] as const;

const formatNumber = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: fractionDigits }).format(value);

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

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

export default async function AdminLedgerPage({ searchParams }: PageProps) {
  const session = await requireServerRole(["owner", "admin"]);
  if (!session.apiToken) {
    notFound();
  }

  const filters = {
    userId: getParam(searchParams.userId).trim(),
    type: getParam(searchParams.type),
    provider: getParam(searchParams.provider).trim(),
    model: getParam(searchParams.model).trim(),
    source: getParam(searchParams.source).trim(),
    refId: getParam(searchParams.refId).trim(),
    from: getParam(searchParams.from),
    to: getParam(searchParams.to)
  } as const;

  const page = Number(getParam(searchParams.page) || "1");
  const limit = Number(getParam(searchParams.limit) || "50");
  const direction: "asc" | "desc" = getParam(searchParams.direction) === "asc" ? "asc" : "desc";

  const queryParams = {
    ...filters,
    page,
    limit,
    direction,
    sort: "createdAt" as const
  };

  const data = await fetchAdminLedger(session.apiToken, queryParams);

  const baseParams = { ...filters, limit, direction, sort: "createdAt" };
  const totalPages = Math.max(1, Math.ceil(data.total / Math.max(limit, 1)));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const toggleDirectionHref = `/admin/ledger${buildUrl(baseParams, {
    direction: direction === "desc" ? "asc" : "desc"
  })}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Ledger</CardTitle>
          <div className="flex items-center gap-2">
            <LedgerExportButton token={session.apiToken} params={baseParams} endpoint="ledger" />
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" method="get">
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-user" className="text-xs font-semibold uppercase text-slate-500">
                User ID
              </label>
              <Input id="ledger-user" name="userId" defaultValue={filters.userId} placeholder="User id" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-type" className="text-xs font-semibold uppercase text-slate-500">
                Type
              </label>
              <select
                id="ledger-type"
                name="type"
                defaultValue={filters.type}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                {ledgerTypes.map((value) => (
                  <option key={value || "all"} value={value}>
                    {value ? value.replace("_", " ") : "All"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-provider" className="text-xs font-semibold uppercase text-slate-500">
                Provider
              </label>
              <Input
                id="ledger-provider"
                name="provider"
                defaultValue={filters.provider}
                placeholder="openai"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-model" className="text-xs font-semibold uppercase text-slate-500">
                Model
              </label>
              <Input id="ledger-model" name="model" defaultValue={filters.model} placeholder="gpt-4o" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-source" className="text-xs font-semibold uppercase text-slate-500">
                Source
              </label>
              <Input id="ledger-source" name="source" defaultValue={filters.source} placeholder="chat_turn" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-ref" className="text-xs font-semibold uppercase text-slate-500">
                Reference
              </label>
              <Input id="ledger-ref" name="refId" defaultValue={filters.refId} placeholder="ref" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-from" className="text-xs font-semibold uppercase text-slate-500">
                From
              </label>
              <Input id="ledger-from" type="date" name="from" defaultValue={filters.from} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="ledger-to" className="text-xs font-semibold uppercase text-slate-500">
                To
              </label>
              <Input id="ledger-to" type="date" name="to" defaultValue={filters.to} />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">Apply</Button>
              <Link href="/admin/ledger" className="text-sm text-slate-500 hover:text-slate-700">
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
                <Link href={toggleDirectionHref} className="flex items-center gap-1">
                  Date
                  <span className="text-xs text-slate-400">{direction === "desc" ? "▼" : "▲"}</span>
                </Link>
              </th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Tokens</th>
              <th className="px-4 py-3">Provider / Model</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3 text-right">Fiat</th>
              <th className="px-4 py-3 text-right">Currency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                  No ledger entries match the current filters.
                </td>
              </tr>
            ) : (
              data.items.map((entry: AdminLedgerRecord) => {
                const fiatCents = entry.amountFiatCents ?? 0;
                const fiat = fiatCents / 100;
                const tokenValue = `${entry.amountTokens >= 0 ? "+" : ""}${formatNumber(entry.amountTokens)}`;
                const showFiat = (entry.type === "spend" || entry.type === "purchase") && fiatCents !== 0;
                const fiatDisplay = showFiat ? formatCurrency(fiat, entry.currency || "INR") : "—";
                const currencyDisplay = showFiat ? entry.currency || "—" : "—";
                return (
                  <Fragment key={entry.id}>
                    <tr className="bg-white align-top">
                      <td className="px-4 py-3 text-slate-600">{new Date(entry.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <Link href={`/admin/wallets?userId=${entry.userId}`} className="font-medium text-sky-600">
                            {entry.userEmail || entry.userId}
                          </Link>
                          <span className="text-xs text-slate-400">{entry.userId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-600">
                          {entry.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${entry.amountTokens >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {tokenValue}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {entry.provider || "—"}
                        {entry.model ? ` / ${entry.model}` : ""}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{entry.source || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{entry.refId || "—"}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{fiatDisplay}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{currencyDisplay}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td colSpan={9} className="px-4 pb-4">
                        <details className="rounded-lg bg-white px-4 py-3 text-xs text-slate-600">
                          <summary className="cursor-pointer text-slate-500">View metadata</summary>
                          <pre className="mt-3 overflow-x-auto text-xs text-slate-700">
                            {JSON.stringify(entry.meta ?? {}, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {currentPage} of {totalPages} • {data.total} entries
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/ledger${buildUrl(baseParams, {
              page: Math.max(1, currentPage - 1)
            })}`}
            className={`rounded-md border px-3 py-2 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Previous
          </Link>
          <Link
            href={`/admin/ledger${buildUrl(baseParams, {
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
