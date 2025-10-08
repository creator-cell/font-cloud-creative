import { requireServerRole } from "@/lib/roles";
import { fetchPlans } from "@/lib/api/admin";
import { PlanEditor } from "@/components/admin/plan-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminBillingPage() {
  const session = await requireServerRole(["owner", "admin", "billing"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const { plans } = await fetchPlans(session.apiToken);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan definitions</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">Edit plan quotas and pricing. Changes sync to Stripe if price IDs are configured.</p>
      </CardHeader>
      <CardContent>
        <PlanEditor token={session.apiToken} plans={plans} />
      </CardContent>
    </Card>
  );
}
