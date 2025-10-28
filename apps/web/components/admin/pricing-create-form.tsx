"use client";

import { useState } from "react";
import { createAdminPricing } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const providers = ["openai", "anthropic", "google", "ollama", "allam"] as const;
const currencies = ["USD", "INR", "SAR"] as const;

const calcCost = (tokensIn: number, tokensOut: number, inputPer1kCents: number, outputPer1kCents: number) => {
  const inputCost = (tokensIn / 1000) * inputPer1kCents;
  const outputCost = (tokensOut / 1000) * outputPer1kCents;
  return Math.round(inputCost + outputCost);
};

type Props = {
  token: string;
  defaults?: {
    provider?: string;
    model?: string;
    currency?: string;
  };
};

export const PricingCreateForm = ({ token, defaults }: Props) => {
  const [provider, setProvider] = useState(defaults?.provider ?? "openai");
  const [model, setModel] = useState(defaults?.model ?? "");
  const [currency, setCurrency] = useState<typeof currencies[number]>(
    (defaults?.currency as typeof currencies[number]) ?? "USD"
  );
  const [inputPer1kCents, setInputPer1kCents] = useState(0);
  const [outputPer1kCents, setOutputPer1kCents] = useState(0);
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [notes, setNotes] = useState("");
  const [tokensIn, setTokensIn] = useState(1000);
  const [tokensOut, setTokensOut] = useState(1000);
  const [saving, setSaving] = useState(false);

  const previewCost = calcCost(tokensIn, tokensOut, inputPer1kCents, outputPer1kCents);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!model.trim()) {
      window.alert("Model id is required");
      return;
    }
    setSaving(true);
    try {
      await createAdminPricing(token, {
        provider: provider as typeof providers[number],
        model: model.trim(),
        currency,
        inputPer1kCents,
        outputPer1kCents,
        effectiveFrom: effectiveFrom || undefined,
        notes: notes || undefined
      });
      window.alert("Pricing entry created");
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Failed to create pricing entry. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Provider
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
          >
            {providers.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Model
          <Input value={model} onChange={(event) => setModel(event.target.value)} placeholder="gpt-4.1-mini" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Currency
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as typeof currency)}
          >
            {currencies.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Input /1K (¢)
          <Input
            type="number"
            min={0}
            value={inputPer1kCents}
            onChange={(event) => setInputPer1kCents(Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Output /1K (¢)
          <Input
            type="number"
            min={0}
            value={outputPer1kCents}
            onChange={(event) => setOutputPer1kCents(Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500">
          Effective From
          <Input
            type="datetime-local"
            value={effectiveFrom}
            onChange={(event) => setEffectiveFrom(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-slate-500 md:col-span-2 lg:col-span-3">
          Notes
          <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional" />
        </label>
      </div>
      <div className="grid gap-3 rounded-lg bg-slate-50 p-3 text-sm">
        <p className="text-xs font-semibold uppercase text-slate-500">Preview Calculator ({currency})</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Tokens In
            <Input
              type="number"
              min={0}
              value={tokensIn}
              onChange={(event) => setTokensIn(Number(event.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Tokens Out
            <Input
              type="number"
              min={0}
              value={tokensOut}
              onChange={(event) => setTokensOut(Number(event.target.value))}
            />
          </label>
          <div className="flex flex-col justify-center rounded-lg bg-white p-3 text-slate-600 shadow-sm">
            <span className="text-xs uppercase text-slate-400">Estimated Cost</span>
            <span className="text-lg font-semibold text-slate-900">
              {(previewCost / 100).toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create pricing entry"}
        </Button>
      </div>
    </form>
  );
};
