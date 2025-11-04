"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type WalletTransaction = {
  id: string;
  type: string;
  direction: "credit" | "debit" | "hold";
  amountTokens: number;
  currency: string | null;
  amountFiatCents: number | null;
  source: string | null;
  refId: string | null;
  provider: string | null;
  model: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
};

const KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "credit", label: "Credits" },
  { value: "debit", label: "Debits" },
  { value: "hold", label: "Holds" }
] as const;

const formatAmount = (amount: number, direction: WalletTransaction["direction"]) => {
  const sign = direction === "debit" ? "-" : direction === "credit" ? "+" : "";
  return `${sign}${amount.toLocaleString()}`;
};

const extractBalance = (meta: Record<string, unknown>): number | null => {
  const balanceAfter = meta?.balanceAfter;
  if (typeof balanceAfter === "number") {
    return balanceAfter;
  }
  return null;
};

const formatRelativeDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

export const WalletTransactionsTable = ({
  initialItems,
  initialCursor
}: {
  initialItems: WalletTransaction[];
  initialCursor: string | null;
}) => {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [kind, setKind] = useState<(typeof KIND_OPTIONS)[number]["value"]>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allItemsRef = useRef(initialItems);
  const allCursorRef = useRef(initialCursor);

  useEffect(() => {
    allItemsRef.current = initialItems;
    allCursorRef.current = initialCursor;
    if (kind === "all") {
      setItems(initialItems);
      setCursor(initialCursor);
    }
  }, [initialCursor, initialItems, kind]);

  const fetchTransactions = useCallback(
    async (options: { kind?: string; cursor?: string | null; replace?: boolean; updateCache?: boolean }) => {
      setLoading(true);
      setError(null);
      try {
        const search = new URLSearchParams();
        search.set("limit", "25");
        if (options.kind && options.kind !== "all") {
          search.set("kind", options.kind);
        }
        if (options.cursor) {
          search.set("cursor", options.cursor);
        }

        const response = await fetch(`/api/wallet/transactions?${search.toString()}`);
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to load transactions");
        }
        const data = (await response.json()) as {
          items: WalletTransaction[];
          nextCursor: string | null;
        };

        setCursor(data.nextCursor);
        if (options.replace) {
          setItems(data.items);
        } else {
          setItems((prev) => [...prev, ...data.items]);
        }

        if (options.updateCache) {
          if (options.replace) {
            allItemsRef.current = data.items;
          } else {
            allItemsRef.current = [...allItemsRef.current, ...data.items];
          }
          allCursorRef.current = data.nextCursor;
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (kind === "all") {
      setItems(allItemsRef.current);
      setCursor(allCursorRef.current ?? null);
      return;
    }
    fetchTransactions({ kind, replace: true });
  }, [kind, fetchTransactions, initialItems, initialCursor]);

  const loadMore = () => {
    if (!cursor || loading) return;
    const updateCache = kind === "all";
    fetchTransactions({ kind, cursor, updateCache });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Wallet Transactions</h2>
          <p className="text-xs text-slate-500">Track token credits, debits, and holds.</p>
        </div>
        <Select value={kind} onValueChange={(value) => setKind(value as typeof KIND_OPTIONS[number]["value"])}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {KIND_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((transaction) => {
              const balance = extractBalance(transaction.meta);
              return (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    <span className="block text-xs text-slate-400">
                      {formatRelativeDate(transaction.createdAt)}
                    </span>
                    <span className="text-sm text-slate-900">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{transaction.type}</span>
                      {transaction.provider && (
                        <span className="text-xs text-slate-500">
                          {transaction.provider}
                          {transaction.model ? ` • ${transaction.model}` : ""}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatAmount(transaction.amountTokens, transaction.direction)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {balance !== null ? balance.toLocaleString() : "--"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {transaction.source ?? "--"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="break-all text-xs text-slate-500">
                      {transaction.refId ?? "--"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No transactions found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        <span>
          {items.length.toLocaleString()} transaction{items.length === 1 ? "" : "s"}
        </span>
        <Button variant="secondary" onClick={loadMore} disabled={!cursor || loading}>
          {loading ? "Loading..." : cursor ? "Load more" : "No more records"}
        </Button>
      </div>
    </div>
  );
};
