"use client";

import { useMemo } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DashboardLangToggle } from "@/components/dashboard-lang-toggle";
import { useDashboardLocale } from "@/components/dashboard-locale-context";

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
  const { t, lang } = useDashboardLocale();
  const planLabel = useMemo(() => formatPlanLabel(plan), [plan]);
  const arabicPlanNames: Record<string, string> = {
    starter: "ستارتر",
    pro: "برو",
    team: "فريق",
    free: "مجانية",
  };
  const planBadge = lang === "ar" ? `${arabicPlanNames[plan.toLowerCase()] ?? plan} ${t("plan")}` : planLabel;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold capitalize text-sky-600">
            {planBadge}
          </span>
          {userName ? <span className="text-sm text-slate-500">{userName}</span> : null}
        </div>
        <div className="flex items-center gap-3">
          <DashboardLangToggle />
          <Button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400">
            {t("createContent")}
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-2 text-sm"
            onClick={() =>
              void signOut({
                callbackUrl: "/",
              })
            }
          >
            {t("logout")}
          </Button>
        </div>
      </div>
    </header>
  );
};
