"use client";

import { useState } from "react";
import {
  createAdminPricing,
  retireAdminPricing,
  updateAdminPricing,
  type ProviderPriceEntry
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

type Props = {
  token: string;
  prices: ProviderPriceEntry[];
};

const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString() : "—");

export const PricingTable = ({ token, prices }: Props) => {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleRetire = async (price: ProviderPriceEntry) => {
    if (!window.confirm(`Retire pricing entry for ${price.model}?`)) return;
    setPendingId(price._id);
    try {
      await retireAdminPricing(token, price._id);
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Failed to retire pricing entry.");
      setPendingId(null);
    }
  };

  const handleEdit = async (price: ProviderPriceEntry) => {
    const inputRaw = window.prompt(
      `New input price (¢ per 1K) for ${price.model}`,
      String(price.inputPer1kCents)
    );
    if (inputRaw === null) return;
    const outputRaw = window.prompt(
      `New output price (¢ per 1K) for ${price.model}`,
      String(price.outputPer1kCents)
    );
    if (outputRaw === null) return;
    const inputPer1kCents = Number(inputRaw);
    const outputPer1kCents = Number(outputRaw);
    if (!Number.isFinite(inputPer1kCents) || !Number.isFinite(outputPer1kCents) || inputPer1kCents < 0 || outputPer1kCents < 0) {
      window.alert("Invalid numbers provided.");
      return;
    }

    setPendingId(price._id);
    try {
      await updateAdminPricing(token, price._id, {
        inputPer1kCents,
        outputPer1kCents
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Failed to update pricing entry.");
      setPendingId(null);
    }
  };

  const handleDuplicate = async (price: ProviderPriceEntry) => {
    const effectiveFrom = window.prompt(
      `Effective from (ISO format) for duplicate of ${price.model}`,
      new Date().toISOString()
    );
    if (effectiveFrom === null) return;

    setPendingId(price._id);
    try {
      await createAdminPricing(token, {
        provider: price.provider as any,
        model: price.model,
        currency: price.currency,
        inputPer1kCents: price.inputPer1kCents,
        outputPer1kCents: price.outputPer1kCents,
        effectiveFrom
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Failed to duplicate pricing entry.");
      setPendingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3 text-right">Input (¢/1K)</th>
            <th className="px-4 py-3 text-right">Output (¢/1K)</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Effective From</th>
            <th className="px-4 py-3">Effective To</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {prices.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                No pricing entries found for the current filters.
              </td>
            </tr>
          ) : (
            prices.map((price) => {
              const isRetired = Boolean(price.effectiveTo && new Date(price.effectiveTo) <= new Date());
              return (
                <tr key={price._id} className="bg-white">
                  <td className="px-4 py-3 font-medium text-slate-900">{price.provider}</td>
                  <td className="px-4 py-3 text-slate-600">{price.model}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{price.inputPer1kCents}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{price.outputPer1kCents}</td>
                  <td className="px-4 py-3 text-slate-600">{price.currency}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(price.effectiveFrom)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(price.effectiveTo)}</td>
                  <td className="px-4 py-3 text-slate-500">{price.notes ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="px-3 py-1 text-sm border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-slate-900"
                        onClick={() => handleEdit(price)}
                        disabled={pendingId === price._id}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-3 py-1 text-sm border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-slate-900"
                        onClick={() => handleDuplicate(price)}
                        disabled={pendingId === price._id}
                      >
                        Duplicate
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-3 py-1 text-sm"
                        onClick={() => handleRetire(price)}
                        disabled={pendingId === price._id || isRetired}
                      >
                        {isRetired ? "Retired" : "Retire"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
