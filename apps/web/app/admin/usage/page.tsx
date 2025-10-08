import { requireServerRole } from "@/lib/roles";
import { fetchTopUsers } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThrottleButton } from "@/components/admin/throttle-button";

const formatNumber = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default async function AdminUsagePage() {
  const session = await requireServerRole(["owner", "admin", "analyst"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const top = await fetchTopUsers(session.apiToken, 100);
  const csvRows = ["email,plan,total_tokens,tokens_in,tokens_out,over_limit"];
  top.users.forEach((user) => {
    csvRows.push(`${user.email},${user.plan},${user.totalTokens},${user.tokensIn},${user.tokensOut},${user.overLimit}`);
  });
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.join("\n"))}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top users by token consumption</h2>
        <div className="flex gap-2">
          <a
            href={csvHref}
            download={`top-users-${top.monthKey}.csv`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-gray-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Export CSV
          </a>
          <ThrottleButton token={session.apiToken} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Month {top.monthKey}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-gray-100 dark:bg-slate-900/30">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Tokens In</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Tokens Out</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Total</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {top.users.map((user) => (
                <tr key={user.userId}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{user.email}</td>
                  <td className="px-3 py-2 text-slate-500 capitalize dark:text-slate-400">{user.plan}</td>
                  <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{formatNumber(user.tokensIn)}</td>
                  <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{formatNumber(user.tokensOut)}</td>
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
}
