import { requireServerRole } from "@/lib/roles";
import { fetchTopUsers } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserActions } from "@/components/admin/user-actions";

const formatNumber = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default async function AdminUsersPage() {
  const session = await requireServerRole(["owner", "admin", "support", "billing"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const top = await fetchTopUsers(session.apiToken, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search coming soon — showing top token consumers for now.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-gray-100 dark:bg-slate-900/30">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Tokens</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Limit</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {top.users.map((user) => (
              <tr key={user.userId}>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{user.email}</td>
                <td className="px-3 py-2 text-slate-500 capitalize dark:text-slate-400">{user.plan ?? "—"}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{formatNumber(user.totalTokens)}</td>
                <td className="px-3 py-2 text-right text-xs">
                  {user.overLimit ? (
                    <span className="rounded bg-rose-500/20 px-2 py-1 text-rose-600 dark:text-rose-300">Over limit</span>
                  ) : (
                    <span className="rounded bg-emerald-500/20 px-2 py-1 text-emerald-600 dark:text-emerald-300">Within limit</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <UserActions
                    token={session.apiToken ?? ""}
                    userId={user.userId}
                    email={user.email}
                    plan={(user.plan ?? "") as string}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
