"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePlanById } from "@/lib/api/admin";

interface PlanEditFormProps {
  plan: any;
  token: string;
}

export const PlanEditForm = ({ plan, token }: PlanEditFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const billing = plan.billing ?? {};
  const tokens = plan.tokens ?? {};

  const [formState, setFormState] = useState(() => ({
    name: plan.name ?? "",
    key: plan.key ?? "",
    monthlyPriceMajor: ((billing.priceCents ?? plan.monthlyPriceINR ?? 0) / 100).toFixed(2),
    monthlyTokens: Number(plan.monthlyTokens ?? tokens.included ?? 0),
    overagePriceMajor: ((tokens.overagePricePer1K ?? plan.overagePer1K ?? 0) / 100).toFixed(2),
    stripePriceId: plan.stripePriceId ?? "",
    features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
    premiumModelAccess: Array.isArray(plan.premiumModelAccess)
      ? plan.premiumModelAccess.join(", ")
      : Array.isArray(plan.providers?.modelAllowlist)
      ? plan.providers.modelAllowlist.join(", ")
      : ""
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "monthlyPriceMajor" || name === "overagePriceMajor"
        ? value
        : type === "number"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const payload = {
          key: formState.key,
          name: formState.name,
          monthlyPriceINR: Math.round((parseFloat(formState.monthlyPriceMajor) || 0) * 100),
          monthlyTokens: Number(formState.monthlyTokens) || 0,
          features: formState.features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          premiumModelAccess: formState.premiumModelAccess
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          overagePer1K: Math.round((parseFloat(formState.overagePriceMajor) || 0) * 100),
          stripePriceId: formState.stripePriceId || undefined
        };

        await updatePlanById(token, plan._id ?? plan.id ?? "", payload);
        router.refresh();
        // eslint-disable-next-line no-alert
        alert("Plan updated successfully.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update plan.";
        setError(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="name">
            Plan name
          </label>
          <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="key">
            Plan key
          </label>
          <Input id="key" name="key" value={formState.key} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="monthlyPriceMajor">
            Price (INR)
          </label>
          <Input
            id="monthlyPriceMajor"
            name="monthlyPriceMajor"
            type="number"
            step="0.01"
            min={0}
            value={formState.monthlyPriceMajor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="monthlyTokens">
            Monthly tokens
          </label>
          <Input
            id="monthlyTokens"
            name="monthlyTokens"
            type="number"
            min={0}
            value={formState.monthlyTokens}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="overagePriceMajor">
            Overage per 1K tokens (INR)
          </label>
          <Input
            id="overagePriceMajor"
            name="overagePriceMajor"
            type="number"
            step="0.01"
            min={0}
            value={formState.overagePriceMajor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="stripePriceId">
            Stripe price ID
          </label>
          <Input
            id="stripePriceId"
            name="stripePriceId"
            value={formState.stripePriceId}
            onChange={handleChange}
            placeholder="price_..."
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="features">
            Features (comma separated)
          </label>
          <Input
            id="features"
            name="features"
            value={formState.features}
            onChange={handleChange}
            placeholder="api_access, file_analysis"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="premiumModelAccess">
            Premium model access (comma separated)
          </label>
          <Input
            id="premiumModelAccess"
            name="premiumModelAccess"
            value={formState.premiumModelAccess}
            onChange={handleChange}
            placeholder="gpt-4o, claude-3-sonnet"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 disabled:bg-sky-300"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
