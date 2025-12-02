import Link from "next/link";
import { notFound } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminWallets, type AdminWalletSummary } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WalletAdjustAction } from "@/components/admin/wallet-adjust-action";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

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

const SORT_FIELDS = new Set(["tokenBalance", "holdAmount", "updatedAt"]);

export default async function AdminWalletsPage({ searchParams }: PageProps) {
  const session = await requireServerRole(["owner", "admin"]);
  if (!session.apiToken) {
    notFound();
  }

  const q = getParam(searchParams.q).trim();
  const page = Number(getParam(searchParams.page) || "1");
  const limit = Number(getParam(searchParams.limit) || "20");
  const sort = SORT_FIELDS.has(getParam(searchParams.sort))
    ? (getParam(searchParams.sort) as "tokenBalance" | "holdAmount" | "updatedAt")
    : "updatedAt";
  const direction = getParam(searchParams.direction) === "asc" ? "asc" : "desc";

  const data = await fetchAdminWallets(session.apiToken, { q, page, limit, sort, direction });

  const baseParams = { q, limit, sort, direction };
  const totalPages = Math.max(1, Math.ceil(data.total / Math.max(limit, 1)));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const renderSortLink = (field: "tokenBalance" | "holdAmount" | "updatedAt", label: string) => {
    const nextDirection = sort === field && direction === "desc" ? "asc" : "desc";
    const href = buildUrl(baseParams, { sort: field, direction: nextDirection, page: 1 });
    const isActive = sort === field;
    return (
      <Link
        href={`/admin/wallets${href}`}
        className={`flex items-center gap-1 text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-500"}`}
      >
        {label}
        <span className="text-xs text-slate-400">{isActive ? (direction === "desc" ? "▼" : "▲") : ""}</span>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Tracked Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(data.stats.users)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Tokens in Circulation</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-600">
            {formatNumber(data.stats.totalBalance)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Tokens on Hold</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-amber-600">
            {formatNumber(data.stats.totalHold)}
          </CardContent>
        </Card>
      </div>

      <form className="flex flex-wrap items-end gap-3" method="get">
        <div className="flex flex-col">
          <label htmlFor="wallet-search" className="text-xs font-semibold uppercase text-slate-500">
            Search by email or user id
          </label>
          <Input
            id="wallet-search"
            name="q"
            defaultValue={q}
            placeholder="user@example.com"
            className="w-64"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Search</Button>
          <Link href="/admin/wallets" className="text-sm text-slate-500 hover:text-slate-700">
            Reset
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3 text-right">{renderSortLink("tokenBalance", "Balance")}</th>
              <th className="px-4 py-3 text-right">{renderSortLink("holdAmount", "On Hold")}</th>
              <th className="px-4 py-3 text-right">Credit Limit</th>
              <th className="px-4 py-3 text-right">{renderSortLink("updatedAt", "Updated")}</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No wallets found for the current filters.
                </td>
              </tr>
            ) : (
              data.items.map((wallet: AdminWalletSummary) => (
                <tr key={wallet.userId} className="bg-white">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{wallet.email || wallet.userId}</span>
                      <span className="text-xs text-slate-400">{wallet.userId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatNumber(wallet.tokenBalance)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatNumber(wallet.holdAmount)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatNumber(wallet.creditLimit)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {new Date(wallet.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <WalletAdjustAction token={session.apiToken ?? ""} wallet={wallet} />
                      <Link
                        href={`/admin/ledger${buildUrl({ userId: wallet.userId }, {})}`}
                        className="text-sm text-sky-600 hover:text-sky-500"
                      >
                        View ledger
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {currentPage} of {totalPages} • {data.total} total wallets
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/wallets${buildUrl(baseParams, {
              page: Math.max(1, currentPage - 1)
            })}`}
            className={`rounded-md border px-3 py-2 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Previous
          </Link>
          <Link
            href={`/admin/wallets${buildUrl(baseParams, {
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
