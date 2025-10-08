import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { UsageMeter } from "@/components/usage-meter";
import { BillingActions } from "@/components/billing/billing-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  const usage = await serverApiFetch<{
    monthKey: string;
    tokensIn: number;
    tokensOut: number;
    quota: number;
    softWarned: boolean;
  }>("/usage/me", session.apiToken);

  return (
    <div className="space-y-6">
      <UsageMeter
        tokensIn={usage.tokensIn}
        tokensOut={usage.tokensOut}
        quota={usage.quota}
        warnings={usage.softWarned ? ["Approaching limit"] : []}
      />
      <Card>
        <CardHeader>
          <CardTitle>Manage billing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <p>Your current plan is <strong>{session.user.plan}</strong>. Upgrade to unlock higher quotas and premium models.</p>
          <BillingActions token={session.apiToken} plan={session.user.plan} />
        </CardContent>
      </Card>
    </div>
  );
}
