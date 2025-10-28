import { notFound } from "next/navigation";
import { requireServerRole } from "@/lib/roles";
import { fetchAdminAlerts } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAlertsTable } from "@/components/admin/admin-alerts-table";

export default async function AdminAlertsPage() {
  const session = await requireServerRole(["owner", "admin"]);
  if (!session.apiToken) {
    notFound();
  }

  const initialData = await fetchAdminAlerts(session.apiToken, { limit: 20 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guardrail Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Monitor safety cap breaches, spend spikes, and balance risks. Alerts are informational only—acknowledge
            once reviewed.
          </p>
        </CardContent>
      </Card>

      <AdminAlertsTable token={session.apiToken} initial={initialData} />
    </div>
  );
}
