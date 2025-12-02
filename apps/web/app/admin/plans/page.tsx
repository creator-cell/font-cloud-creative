import Link from "next/link";
import { clsx } from "clsx";
import { requireServerRole } from "@/lib/roles";
import { fetchPlans } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { PlanRowActions } from "@/components/admin/plan-row-actions";

export const metadata = {
  title: "Plans | Admin"
};

const formatCurrency = (value?: number, currency: string = "INR") => {
  if (value === undefined || value === null) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency
    }).format(value / 100);
  } catch {
    return `${(value / 100).toFixed(2)} ${currency}`;
  }
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) {
    return "—";
  }
  return value.toLocaleString();
};

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "—";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString();
};

export default async function AdminPlansPage() {
  const session = await requireServerRole(["owner", "admin", "billing"]);
  if (!session.apiToken) {
    throw new Error("Missing admin API token");
  }

  const { plans } = await fetchPlans(session.apiToken);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Plans</h1>
          <p className="text-sm text-slate-500">
            Review all published and draft plans in the system. Use the create button to add new pricing tiers.
          </p>
        </div>
        <Link
          href="/admin/plans/new"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          Create plan
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Available plans</h2>
            <p className="text-xs text-slate-500">{plans.length} configured plan{plans.length === 1 ? "" : "s"}.</p>
          </div>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
            Sorted by visibility order
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Included Tokens</th>
                <th className="px-4 py-3">Overage / 1K</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Public?</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plans.map((plan: any) => {
                const billing = plan.billing ?? {};
                const tokens = plan.tokens ?? {};
                const visibility = plan.visibility ?? {};
                return (
                  <tr key={plan._id ?? plan.key} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{plan.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{plan.description ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{plan.key}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{billing.type ?? "—"}</td>
                    <td className="px-4 py-3">{formatCurrency(billing.priceCents, billing.currency)}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{billing.period ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatNumber(tokens.included)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(tokens.overagePricePer1K, billing.currency)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          plan.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : plan.status === "draft"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {plan.status ?? "unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{visibility.public ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(plan.updatedAt)}</td>
                    <td className="px-4 py-3">
                      {plan._id ? (
                        <div className="inline-flex">
                          <PlanRowActions
                            planId={plan._id}
                            editHref={`/admin/plans/${plan._id}`}
                            token={session.apiToken!}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {plans.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-slate-500">No plans configured yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
