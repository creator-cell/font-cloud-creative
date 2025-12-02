import Link from "next/link";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminUsers } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserActions } from "@/components/admin/user-actions";

const buildUsersHref = (page: number, q?: string) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin/users${qs ? `?${qs}` : ""}`;
};

const formatDate = (date: string | Date) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

export default async function AdminUsersPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const session = await requireServerRole(["owner", "admin", "support", "billing"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const pageParam = Number(typeof searchParams?.page === "string" ? searchParams.page : 1);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const users = await fetchAdminUsers(session.apiToken, { q, page, limit: 25 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">Search and manage user accounts directly from the database.</p>
        <form className="mt-4 flex flex-col gap-3 md:flex-row md:items-center" action="/admin/users" method="get">
          <Input
            name="q"
            placeholder="Search by email or name"
            defaultValue={q}
            className="md:max-w-xs"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">Search</Button>
            {q ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/users">Clear</Link>
              </Button>
            ) : null}
          </div>
        </form>
        <p className="text-xs text-slate-400 dark:text-slate-500">Showing {users.items.length} of {users.total} users.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-gray-100 dark:bg-slate-900/30">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Seats</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Roles</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Created</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.items.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{user.email}</td>
                  <td className="px-3 py-2 text-slate-500 capitalize dark:text-slate-400">{user.plan}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{user.seats ?? 1}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{user.roles.join(", ") || "user"}</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{formatDate(user.createdAt)}</td>
                  <td className="px-3 py-2 text-right">
                    <UserActions token={session.apiToken} userId={user.id} email={user.email} plan={user.plan} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Page {users.page} of {users.pages}</span>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" disabled={users.page <= 1}>
              <Link href={buildUsersHref(Math.max(1, users.page - 1), q)}>Previous</Link>
            </Button>
            <Button asChild size="sm" variant="outline" disabled={users.page >= users.pages}>
              <Link href={buildUsersHref(Math.min(users.pages, users.page + 1), q)}>Next</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
