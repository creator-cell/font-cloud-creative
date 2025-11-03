import { requireServerRole } from "@/lib/roles";
import {
  fetchAnalyticsTopUsers,
  fetchAnalyticsTopModels
} from "@/lib/api/admin";
import { AnalyticsTop } from "@/components/admin/analytics/analytics-top";
import { AdminErrorState } from "@/components/admin/admin-error";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

const toDateInput = (iso: string) => iso.slice(0, 10);

const parseLimit = (value: string | undefined) => {
  if (!value) return 20;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return 20;
  return Math.min(parsed, 200);
};

export default async function AdminAnalyticsTopPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await requireServerRole(["owner", "admin", "analyst"]);
  if (!session.apiToken) {
    return <AdminErrorState message="Missing admin authentication token." />;
  }

  const now = new Date();
  const toParam = typeof searchParams?.to === "string" ? searchParams.to : undefined;
  const fromParam = typeof searchParams?.from === "string" ? searchParams.from : undefined;
  const limitParam = typeof searchParams?.limit === "string" ? searchParams.limit : undefined;
  const tzParam = typeof searchParams?.tz === "string" ? searchParams.tz : undefined;

  const toDate = toParam ? new Date(toParam) : now;
  const defaultFrom = new Date(toDate);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);
  const fromDate = fromParam ? new Date(fromParam) : defaultFrom;
  const limit = parseLimit(limitParam);
  const timezone = tzParam ?? DEFAULT_TIMEZONE;

  const [topUsers, topModels] = await Promise.all([
    fetchAnalyticsTopUsers(session.apiToken, { from: fromDate.toISOString(), to: toDate.toISOString(), limit }),
    fetchAnalyticsTopModels(session.apiToken, { from: fromDate.toISOString(), to: toDate.toISOString(), limit })
  ]);

  return (
    <AnalyticsTop
      usersResponse={topUsers}
      modelsResponse={topModels}
      initialFilters={{
        from: toDateInput(topUsers.from ?? fromDate.toISOString()),
        to: toDateInput(topUsers.to ?? toDate.toISOString()),
        limit,
        tz: timezone
      }}
    />
  );
}

