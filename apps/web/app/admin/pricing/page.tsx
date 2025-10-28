import Link from "next/link";
import { notFound } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminPricing } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PricingCreateForm } from "@/components/admin/pricing-create-form";
import { PricingTable } from "@/components/admin/pricing-table";

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

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function AdminPricingPage({ searchParams }: PageProps) {
  const session = await requireServerRole(["owner", "admin"]);
  if (!session.apiToken) {
    notFound();
  }

  const filters = {
    provider: getParam(searchParams.provider).trim(),
    model: getParam(searchParams.model).trim(),
    currency: getParam(searchParams.currency).trim()
  } as const;

  const page = Number(getParam(searchParams.page) || "1");
  const limit = Number(getParam(searchParams.limit) || "25");

  const data = await fetchAdminPricing(session.apiToken, {
    ...filters,
    page,
    limit
  });

  const baseParams = { ...filters, page, limit };
  const totalPages = Math.max(1, Math.ceil(data.total / Math.max(limit, 1)));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Pricing Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingCreateForm
            token={session.apiToken}
            defaults={{
              provider: filters.provider || undefined,
              model: filters.model || undefined,
              currency: (filters.currency as "USD" | "INR" | "SAR") || undefined
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" method="get">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
              Provider
              <Input name="provider" defaultValue={filters.provider} placeholder="openai" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
              Model
              <Input name="model" defaultValue={filters.model} placeholder="gpt-4.1-mini" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
              Currency
              <select
                name="currency"
                defaultValue={filters.currency}
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">All</option>
                {["USD", "INR", "SAR"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit">Apply</Button>
              <Link href="/admin/pricing" className="text-sm text-slate-500 hover:text-slate-700">
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <PricingTable token={session.apiToken} prices={data.items} />

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Page {currentPage} of {totalPages} • {data.total} entries
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/pricing${buildUrl(baseParams, { page: Math.max(1, currentPage - 1) })}`}
            className={`rounded-md border px-3 py-2 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Previous
          </Link>
          <Link
            href={`/admin/pricing${buildUrl(baseParams, { page: Math.min(totalPages, currentPage + 1) })}`}
            className={`rounded-md border px-3 py-2 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-slate-100"}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
