"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCheckoutSession } from "@/lib/api/endpoints";

const plans = [
  {
    id: "starter" as const,
    label: "Starter",
    price: "$29",
    description: "30k monthly tokens, unlock Anthropic Haiku",
    perks: ["30k tokens", "Anthropic Haiku", "Gemini Flash"]
  },
  {
    id: "pro" as const,
    label: "Pro",
    price: "$99",
    description: "1M tokens, premium providers unlocked",
    perks: ["1M tokens", "GPT-4o", "Claude Sonnet"]
  },
  {
    id: "team" as const,
    label: "Team",
    price: "Custom",
    description: "3M tokens, seats & priority support",
    perks: ["3M tokens", "Team seats", "Priority SLA"]
  }
];

export const PlanSelector = ({ token }: { token: string }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const handleSelect = async (plan: "starter" | "pro" | "team") => {
    setLoadingPlan(plan);
    try {
      const { url } = await createCheckoutSession(token, plan);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Please try again or contact support.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>{plan.label}</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {plan.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
            </CardContent>
          </div>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => handleSelect(plan.id)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? "Redirecting..." : "Upgrade"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
