import { requireServerRole } from "@/lib/roles";
import {
  fetchAnalyticsSummary,
  fetchAnalyticsTimeseries,
  fetchAnalyticsDistribution
} from "@/lib/api/admin";
import { AnalyticsOverview } from "@/components/admin/analytics/analytics-overview";
import { AdminErrorState } from "@/components/admin/admin-error";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

const toDateInput = (iso: string) => iso.slice(0, 10);

const isInterval = (value: string | undefined): value is "day" | "week" | "month" =>
  value === "day" || value === "week" || value === "month";

export default async function AdminAnalyticsOverview({
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
  const intervalParam = typeof searchParams?.interval === "string" ? searchParams.interval : undefined;
  const tzParam = typeof searchParams?.tz === "string" ? searchParams.tz : undefined;

  const toDate = toParam ? new Date(toParam) : now;
  const defaultFrom = new Date(toDate);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);
  const fromDate = fromParam ? new Date(fromParam) : defaultFrom;
  const toIso = toDate.toISOString();
  const fromIso = fromDate.toISOString();
  const interval = isInterval(intervalParam) ? intervalParam : "day";
  const timezone = tzParam ?? DEFAULT_TIMEZONE;

  try {
    const [summary, timeseries, distribution] = await Promise.all([
      fetchAnalyticsSummary(session.apiToken, { from: fromIso, to: toIso, tz: timezone }),
      fetchAnalyticsTimeseries(session.apiToken, { from: fromIso, to: toIso, tz: timezone, interval }),
      fetchAnalyticsDistribution(session.apiToken, { from: fromIso, to: toIso })
    ]);

    return (
      <AnalyticsOverview
        summary={summary}
        timeseries={timeseries}
        distribution={distribution}
        initialFilters={{
          from: toDateInput(summary.from ?? fromIso),
          to: toDateInput(summary.to ?? toIso),
          interval,
          tz: timezone
        }}
      />
    );
  } catch (error) {
    console.error("Failed to load analytics overview", error);
    return <AdminErrorState message="Unable to load analytics overview." />;
  }
}
