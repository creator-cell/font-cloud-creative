"use client";

import { useState } from "react";
import { upsertFeatureFlag } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FlagListProps {
  token: string;
  flags: Array<{ key: string; description?: string; enabled: boolean; rolloutPercent: number }>;
}

export const FlagList = ({ token, flags }: FlagListProps) => {
  const [items, setItems] = useState(flags);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleSave = async (flag: (typeof flags)[number]) => {
    setLoadingKey(flag.key);
    try {
      await upsertFeatureFlag(token, flag);
      alert("Flag saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save flag");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleToggle = (key: string, enabled: boolean) => {
    setItems((prev) => prev.map((flag) => (flag.key === key ? { ...flag, enabled } : flag)));
  };

  const handleRollout = (key: string, value: number) => {
    setItems((prev) => prev.map((flag) => (flag.key === key ? { ...flag, rolloutPercent: value } : flag)));
  };

  return (
    <div className="space-y-4">
      {items.map((flag) => (
        <div key={flag.key} className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{flag.key}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{flag.description ?? "No description"}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={(event) => handleToggle(flag.key, event.target.checked)}
                />
                Enabled
              </label>
              <Input
                type="number"
                className="h-8 w-20"
                value={flag.rolloutPercent}
                onChange={(event) => handleRollout(flag.key, Number(event.target.value))}
              />
              <Button
                onClick={() => handleSave(flag)}
                disabled={loadingKey === flag.key}
                className="px-3 py-1 text-sm"
              >
                {loadingKey === flag.key ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
