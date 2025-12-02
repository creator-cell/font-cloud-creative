"use client";

import { useState } from "react";
import { upsertPlan } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PlanEditorProps {
  token: string;
  plans: Array<{
    key: string;
    name: string;
    monthlyPriceINR: number;
    monthlyTokens: number;
    features: string[];
    premiumModelAccess?: string[];
    overagePer1K: number;
    stripePriceId?: string;
  }>;
}

export const PlanEditor = ({ token, plans }: PlanEditorProps) => {
  const [working, setWorking] = useState<string | null>(null);

  const handleSave = async (planKey: string, form: HTMLFormElement) => {
    const data = new FormData(form);
    const featuresInput = (data.get("features") as string | null) ?? "";
    const premiumModelAccessInput = (data.get("premiumModelAccess") as string | null) ?? "";
    const payload = {
      key: planKey,
      name: String(data.get("name")),
      monthlyPriceINR: Number(data.get("monthlyPriceINR")),
      monthlyTokens: Number(data.get("monthlyTokens")),
      overagePer1K: Number(data.get("overagePer1K")),
      features: featuresInput
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      premiumModelAccess: premiumModelAccessInput
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      stripePriceId: String(data.get("stripePriceId") ?? "").trim() || undefined
    };

    setWorking(planKey);
    try {
      await upsertPlan(token, payload);
      alert("Plan saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save plan");
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="grid gap-6">
      {plans.map((plan) => (
        <form
          key={plan.key}
          className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave(plan.key, event.currentTarget);
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 uppercase dark:text-white">{plan.key}</h3>
            <Button type="submit" size="sm" disabled={working === plan.key}>
              {working === plan.key ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Name
              <Input name="name" defaultValue={plan.name} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Monthly price (INR)
              <Input name="monthlyPriceINR" type="number" defaultValue={plan.monthlyPriceINR} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Monthly tokens
              <Input name="monthlyTokens" type="number" defaultValue={plan.monthlyTokens} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Overage / 1K
              <Input name="overagePer1K" type="number" defaultValue={plan.overagePer1K} className="mt-1" />
            </label>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Features (one per line)
              <Textarea name="features" rows={4} defaultValue={plan.features.join("\n")} className="mt-1" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Premium models (one per line)
              <Textarea
                name="premiumModelAccess"
                rows={4}
                defaultValue={(plan.premiumModelAccess ?? []).join("\n")}
                className="mt-1"
              />
            </label>
          </div>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Stripe price ID
            <Input name="stripePriceId" defaultValue={plan.stripePriceId ?? ""} className="mt-1" />
          </label>
        </form>
      ))}
    </div>
  );
};
