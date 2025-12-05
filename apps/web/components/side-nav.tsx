"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  MicVocal,
  Bot,
  CreditCard,
  Settings,
  ChevronDown,
  Wallet as WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { useDashboardLocale } from "@/components/dashboard-locale-context";

type NavLink = {
  href: string;
  labelKey: keyof typeof linkTranslations;
  Icon: LucideIcon;
  allowedRoles?: string[];
  children?: NavLink[];
};

type UsageSummary = {
  monthKey: string;
  tokensIn: number;
  tokensOut: number;
  generations: number;
  quota: number;
  softWarned: boolean;
  availableTokens: number;
  totalAllocatedTokens: number;
};

const linkTranslations = {
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  projects: { en: "Projects", ar: "المشاريع" },
  frontCloudAi: { en: "Front Cloud AI", ar: "فرونت كلاود للذكاء الاصطناعي" },
  brandVoice: { en: "Brand Voice", ar: "هوية العلامة" },
  aiAnalysis: { en: "AI Analysis", ar: "تحليل بالذكاء الاصطناعي" },
  generate: { en: "Generate", ar: "إنشاء" },
  wallet: { en: "Wallet", ar: "المحفظة" },
  billing: { en: "Billing", ar: "الفوترة" },
  settings: { en: "Settings", ar: "الإعدادات" },
};

const navLinks: NavLink[] = [
  { href: "/dashboard", labelKey: "dashboard", Icon: LayoutDashboard },
  { href: "/projects", labelKey: "projects", Icon: FolderKanban },
  {
    href: "#front-cloud-ai",
    labelKey: "frontCloudAi",
    Icon: Sparkles,
    children: [
      { href: "/brand-voice", labelKey: "brandVoice", Icon: MicVocal },
      {
        href: "/chat/single",
        labelKey: "aiAnalysis",
        Icon: Bot,
        allowedRoles: ["owner", "admin", "developer", "user"],
      },
    ],
  },
  { href: "/generate", labelKey: "generate", Icon: Sparkles },
  { href: "/wallet", labelKey: "wallet", Icon: WalletIcon },
  { href: "/billing", labelKey: "billing", Icon: CreditCard },
  { href: "/settings", labelKey: "settings", Icon: Settings },
];

export const SideNav = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { lang } = useDashboardLocale();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const roles = session?.user?.roles?.map((role) => role.toLowerCase()) ?? [];
  const tLink = (key: keyof typeof linkTranslations) =>
    linkTranslations[key]?.[lang] ?? linkTranslations[key]?.en ?? key;

  const visibleLinks = navLinks.filter(({ allowedRoles }) => {
    if (!allowedRoles?.length) return true;
    if (!roles.length) return false;
    return allowedRoles.some((role) => roles.includes(role));
  });

  useEffect(() => {
    if (!session?.user) {
      setUsage(null);
      return;
    }

    const controller = new AbortController();
    setLoadingUsage(true);

    fetch("/api/usage/me", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to load usage");
        }
        return (await response.json()) as UsageSummary;
      })
      .then((data) => {
        setUsage(data);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load usage summary", error);
        setUsage(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingUsage(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [session?.user]);

  const usageMetrics = useMemo(() => {
    if (!usage) {
      return {
        used: null as number | null,
        quota: null as number | null,
        available: null as number | null,
        percent: 0,
      };
    }
    const quota = usage.totalAllocatedTokens ?? usage.quota ?? 0;
    const available =
      usage.tokenBalance ?? usage.availableTokens ?? Math.max(quota - (usage.tokensIn + usage.tokensOut), 0);
    const used = Math.max(quota - available, 0);
    const percent = quota > 0 ? Math.min(Math.max(used / quota, 0), 1) : 0;
    return { used, quota, available: Math.max(available, 0), percent };
  }, [usage]);

  const planLabel = (session?.user?.plan ?? "starter").toUpperCase();
  const tokenUsageLabel = lang === "ar" ? "استخدام الرصيد" : "Token Usage";

  return (
    <aside className="flex h-full w-full flex-col bg-white lg:sticky lg:top-0 lg:h-screen">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 px-4 pb-4 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
            <Image src="/logo.svg" alt="Front Cloud Creative" width={22} height={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Front Cloud</p>
            <p className="text-[11px] text-slate-500">Creative AI Platform</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {visibleLinks.map(({ href, labelKey, Icon, children }) => {
            if (children && children.length > 0) {
              const visibleChildren = children.filter(({ allowedRoles: childRoles }) => {
                if (!childRoles?.length) return true;
                if (!roles.length) return false;
                return childRoles.some((role) => roles.includes(role));
              });

              if (visibleChildren.length === 0) return null;

              const isGroupActive = visibleChildren.some((child) => pathname === child.href);
              const isExpanded = expandedGroups[labelKey] ?? isGroupActive;
              const toggleGroup = () =>
                setExpandedGroups((previous) => ({
                  ...previous,
                  [labelKey]: !(previous[labelKey] ?? isGroupActive),
                }));

              return (
                <div key={labelKey} className="flex flex-col">
                  <div
                    className={clsx(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600",
                      isGroupActive && "bg-sky-50 text-sky-600"
                    )}
                    onClick={toggleGroup}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleGroup();
                      }
                    }}
                    role="button"
                    aria-expanded={isExpanded}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-slate-400" />
                      {tLink(labelKey)}
                    </div>
                    <ChevronDown
                      className={clsx(
                        "h-4 w-4 text-slate-400 transition-transform duration-500 ease-in-out",
                        isExpanded ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </div>
                  <div
                    className={clsx(
                      "ml-9 flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out",
                      isExpanded ? "mt-1 max-h-72 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    )}
                    aria-hidden={!isExpanded}
                  >
                    {visibleChildren.map(({ href: childHref, labelKey: childLabel, Icon: ChildIcon }) => {
                      const isActive = pathname === childHref;
                      return (
                        <Link
                          key={childHref}
                          href={childHref}
                          className={clsx(
                            "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                            isActive
                              ? "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          )}
                        >
                          <ChildIcon
                            className={clsx(
                              "h-4 w-4 transition-colors duration-300",
                              isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"
                            )}
                          />
                          {tLink(childLabel)}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <Icon
                  className={clsx(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {tLink(labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-slate-200 bg-slate-50 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tokenUsageLabel}</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{ width: `${usageMetrics.percent * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>
            {usageMetrics.available !== null
              ? usageMetrics.available.toLocaleString()
              : loadingUsage
                ? "…"
                : "--"}
          </span>
          <span>
            {usageMetrics.quota !== null
              ? usageMetrics.quota.toLocaleString()
              : loadingUsage
                ? "…"
                : "--"}
          </span>
        </div>
        <span className="mt-4 inline-block rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-600">
          {planLabel}
        </span>
      </div>
    </aside>
  );
};
