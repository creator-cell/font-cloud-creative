"use client";

import { useMemo } from "react";

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
      <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-slate-900">Build Multi-AI Content Platform</h1>
          <p className="text-sm text-slate-500">
            {userName ? `Welcome back, ${userName.split(" ")[0]}! Here's your content creation overview.` : `Welcome back! Here's your content creation overview.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold capitalize text-sky-600">
            {planLabel}
          </span>
          <Button className="rounded-full bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-400">
            Create Content
          </Button>
        </div>
      </div>
    </header>
  );
};
