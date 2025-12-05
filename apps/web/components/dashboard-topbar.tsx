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
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-8">

        {/* Left Side: Plan + Name */}
        <div className="flex  items-center justify-between gap-1 md:flex-row md:items-center md:gap-3">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold capitalize text-sky-600">
            {planLabel}
          </span>

          {userName && (
            <span className="text-sm text-slate-500 truncate max-w-[150px] md:max-w-none">
              {userName}
            </span>
          )}
        </div>

        {/* Right Side: Buttons */}
        <div className="flex  gap-2 sm:flex-row sm:items-center">
          <Button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 w-full sm:w-auto">
            Create Content
          </Button>

          <Button
            variant="secondary"
            className="px-3 py-2 text-sm w-full sm:w-auto"
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
