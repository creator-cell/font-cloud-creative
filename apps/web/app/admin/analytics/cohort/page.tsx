import { requireServerRole } from "@/lib/roles";
import { fetchAnalyticsCohort } from "@/lib/api/admin";
import { AnalyticsCohortView } from "@/components/admin/analytics/analytics-cohort";
import { AdminErrorState } from "@/components/admin/admin-error";

const weeksParamToNumber = (value: string | undefined) => {
  if (!value) return 8;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return 8;
  return Math.min(parsed, 26);
};

const startOfWeekUtc = (date: Date) => {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // align to Monday
  result.setUTCDate(result.getUTCDate() + diff);
  result.setUTCHours(0, 0, 0, 0);
  return result;
};

export default async function AdminAnalyticsCohortPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await requireServerRole(["owner", "admin", "analyst"]);
  if (!session.apiToken) {
    return <AdminErrorState message="Missing admin authentication token." />;
  }

  const weeks = weeksParamToNumber(typeof searchParams?.weeks === "string" ? searchParams.weeks : undefined);
  const startParam = typeof searchParams?.start === "string" ? searchParams.start : undefined;

  const now = new Date();
  const currentWeekStart = startOfWeekUtc(now);
  const defaultStart = new Date(currentWeekStart);
  defaultStart.setUTCDate(defaultStart.getUTCDate() - weeks * 7);

  const startDate = startParam ? new Date(startParam) : defaultStart;
  startDate.setUTCHours(0, 0, 0, 0);

  const cohort = await fetchAnalyticsCohort(session.apiToken, {
    start: startDate.toISOString(),
    weeks
  });

  return (
    <AnalyticsCohortView
      cohort={cohort}
      initialFilters={{
        start: startDate.toISOString().slice(0, 10),
        weeks
      }}
    />
  );
}

