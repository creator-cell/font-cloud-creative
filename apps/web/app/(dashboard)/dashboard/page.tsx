import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { serverApiFetch } from "@/lib/server-api";
import { UsageMeter } from "@/components/usage-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.apiToken) {
    redirect("/api/auth/signin");
  }

  let usage;
  try {
    usage = await serverApiFetch<{
      monthKey: string;
      tokensIn: number;
      tokensOut: number;
      generations: number;
      quota: number;
      softWarned: boolean;
    }>("/usage/me", session.apiToken);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401) {
      redirect("/api/auth/signin");
    }
    throw err;
  }

  return (
    <div className="space-y-6">
      <UsageMeter
        tokensIn={usage.tokensIn}
        tokensOut={usage.tokensOut}
        quota={usage.quota}
        warnings={usage.softWarned ? ["You are approaching your token limit"] : []}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>Create or import a project.</li>
              <li>Build a brand voice style card.</li>
              <li>Select your preferred provider in Generate.</li>
              <li>Review usage and upgrade if you hit limits.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need more headroom?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Upgrade to unlock Anthropic, Gemini, and GPT-4o for premium-quality campaigns.</p>
            <Button asChild className="w-full">
              <a href="/billing">Manage plan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
