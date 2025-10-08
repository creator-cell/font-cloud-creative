import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { PlanSelector } from "@/components/plan-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Choose your plan</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            One subscription unlocks OpenAI, Anthropic, Google, and Ollama. Start free, upgrade when you're ready.
          </p>
        </CardHeader>
        <CardContent>
          {session.apiToken ? (
            <PlanSelector token={session.apiToken} />
          ) : (
            <p className="text-sm text-slate-300">
              We are syncing your workspace. Refresh in a moment to choose a plan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
