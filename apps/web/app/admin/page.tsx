import { requireServerRole } from "@/lib/roles";
import { fetchAdminOverview, fetchMRR, fetchTopUsers } from "@/lib/api/admin";
import { KpiCard } from "@/components/admin/kpi-card";
import { OverviewCharts } from "@/components/admin/overview-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminErrorState } from "@/components/admin/admin-error";

const formatNumber = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default async function AdminOverviewPage() {
  const session = await requireServerRole(["owner", "admin", "analyst", "support", "billing", "user"]);
  if (!session.apiToken) {
    return <AdminErrorState message="Your session is missing the admin token. Please sign in again." />;
  }

  try {
    const [overview, mrr, topUsers] = await Promise.all([
      fetchAdminOverview(session.apiToken, "30d"),
      fetchMRR(session.apiToken),
      fetchTopUsers(session.apiToken, 5)
    ]);

  const providerData = Object.entries(overview.tokenBurnByProvider).map(([provider, stats]) => ({
    provider,
    tokensIn: stats.in,
    tokensOut: stats.out
  }));

  const planMix = Object.entries(overview.planMix).map(([plan, value]) => ({ plan, value }));

  const signupTrend = (overview.trend ?? []).map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: point.signups
  }));

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="DAU" value={formatNumber(overview.dau)} subtitle="Daily active users" />
        <KpiCard title="New Signups (30d)" value={formatNumber(overview.newSignups)} />
        <KpiCard title="MRR" value={`₹${formatNumber(mrr.mrr ?? overview.mrr)}`} subtitle="Monthly recurring revenue" />
        <KpiCard title="ARPU" value={`₹${formatNumber(Math.round(overview.arpu))}`} />
        <KpiCard title="Active Paid" value={formatNumber(overview.activePaid)} />
        <KpiCard title="Churn" value={`${overview.churn?.toFixed(2) ?? "0.00"}%`} />
      </div>

      <OverviewCharts providerData={providerData} planMix={planMix} signupTrend={signupTrend} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top creators by token usage</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current month</p>
          </div>
          <a
            href="/admin/usage"
            className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-slate-900 transition hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            View usage
          </a>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-gray-100 dark:bg-slate-900/30">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">User</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tokens</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {topUsers.users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{user.email}</td>
                  <td className="px-3 py-2 text-slate-500 capitalize dark:text-slate-400">{user.plan}</td>
                  <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{formatNumber(user.totalTokens)}</td>
                  <td className="px-3 py-2 text-right text-xs">
                    {user.overLimit ? (
                      <span className="rounded bg-rose-500/20 px-2 py-1 text-rose-600 dark:text-rose-300">Over limit</span>
                    ) : (
                      <span className="rounded bg-emerald-500/20 px-2 py-1 text-emerald-600 dark:text-emerald-300">Within limit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
    );
  } catch (error) {
    console.error("Failed to load admin overview", error);
    return <AdminErrorState message="Unable to load admin dashboard. Please try signing in again." />;
  }
}
