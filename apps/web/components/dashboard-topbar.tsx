"use client";

import { useMemo } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  plan: string;
  userName?: string | null;
};

const formatPlanLabel = (plan: string) => {
  if (!plan) return "starter plan";
  const normalized = plan.toLowerCase();
  if (normalized.includes("starter")) return "starter plan";
  return `${normalized} plan`;
};

export const DashboardTopbar = ({ plan, userName }: DashboardTopbarProps) => {
  const planLabel = useMemo(() => formatPlanLabel(plan), [plan]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold capitalize text-sky-600">
            {planLabel}
          </span>
          {userName ? <span className="text-sm text-slate-500">{userName}</span> : null}
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-full bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-400">
            Create Content
          </Button>
          <Button
            variant="secondary"
            className="text-sm"
            onClick={() =>
              void signOut({
                callbackUrl: "/",
              })
            }
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};
