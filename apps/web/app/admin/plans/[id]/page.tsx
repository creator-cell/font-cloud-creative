import { notFound } from "next/navigation";
import Link from "next/link";
import { requireServerRole } from "@/lib/roles";
import { fetchPlanById } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanEditForm } from "@/components/admin/plan-edit-form";

interface PageProps {
  params: { id: string };
}

export default async function AdminPlanEditPage({ params }: PageProps) {
  const session = await requireServerRole(["owner", "admin", "billing"]);
  if (!session.apiToken) {
    throw new Error("Missing admin API token");
  }

  const planId = params.id;
  let planData: any;
  try {
    const response = await fetchPlanById(session.apiToken, planId);
    planData = response.plan;
  } catch (error) {
    console.error("Failed to load plan", error);
    notFound();
  }

  if (!planData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit plan</h1>
          <p className="text-sm text-slate-500">Update pricing, features, and tokens for {planData.name}.</p>
        </div>
        <Link href="/admin/plans" className="text-sm text-sky-600">
          ← Back to plans
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan details</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanEditForm plan={planData} token={session.apiToken} />
        </CardContent>
      </Card>
    </div>
  );
}
