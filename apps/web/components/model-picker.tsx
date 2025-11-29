"use client";

import { ProviderModelSummary } from "@/lib/api/endpoints";
import { clsx } from "clsx";
import { useState } from "react";

interface ModelPickerProps {
  models: ProviderModelSummary[];
  selected?: { provider: string; model: string };
  onChange: (selection: { provider: string; model: string }) => void;
}

export const ModelPicker = ({ models, selected, onChange }: ModelPickerProps) => {
  const [selectedProvider, setSelectedProvider] = useState(
    selected?.provider || models[0]?.provider
  );

  return (
    <div className="space-y-4">

      {/* PROVIDER DROPDOWN */}
      <select
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:bg-slate-900 dark:border-slate-700"
      >
        {models.map((provider) => (
          <option key={provider.provider} value={provider.provider}>
            {provider.provider}
          </option>
        ))}
      </select>

      {/* PROVIDER SECTION */}
      {models
        .filter((p) => p.provider === selectedProvider)
        .map((provider) => (
          <div
            key={provider.provider}
            className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-slate-900 capitalize dark:text-white">
              {provider.provider}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {provider.models.map((model) => {
                const isSelected =
                  selected?.provider === provider.provider &&
                  selected?.model === model.id;

                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() =>
                      model.available &&
                      onChange({
                        provider: provider.provider,
                        model: model.id,
                      })
                    }
                    disabled={!model.available}
                    className={clsx(
                      "rounded-md border p-3 text-left transition",
                      isSelected
                        ? "border-brand bg-brand/10"
                        : "border-slate-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950",
                      model.available ? "hover:border-brand" : "opacity-50"
                    )}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {model.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${model.estCostPer1K.toFixed(2)} / 1K tokens
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Min plan: {model.minPlan}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};
