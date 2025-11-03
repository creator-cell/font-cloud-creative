"use client";

import { motion } from "framer-motion";
import { Brain, Bot, Search, Zap, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fadeIn } from "../animations";

interface ProviderItem {
  key: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  badge?: string;
  colSpan?: string;
}

interface ProviderSectionProps {
  copy: {
    providerHeading: string;
    providerOpenAI: string;
    providerAnthropic: string;
    providerGoogle: string;
    providerOllama: string;
    providerAllam: string;
    providerAllamSubtitle: string;
  };
}

export const ProviderSection = ({ copy }: ProviderSectionProps) => {
  const providerItems: ProviderItem[] = [
    {
      key: "openai",
      label: copy.providerOpenAI,
      icon: Bot,
      iconBg: "bg-[#00bc7d]"
    },
    {
      key: "anthropic",
      label: copy.providerAnthropic,
      icon: Brain,
      iconBg: "bg-[#ff6a00]"
    },
    {
      key: "google",
      label: copy.providerGoogle,
      icon: Search,
      iconBg: "bg-[#2b80ff]"
    },
    {
      key: "ollama",
      label: copy.providerOllama,
      icon: Zap,
      iconBg: "bg-[#ab45ff]"
    },
    {
      key: "allam",
      label: copy.providerAllam,
      badge: copy.providerAllamSubtitle,
      icon: Sparkles,
      iconBg: "bg-[#0EA5E9]",
      colSpan: "lg:col-span-2"
    }
  ];

  return (
    <motion.div className="space-y-6 md:mt-8 overflow-visible" {...fadeIn(0.2)}>
      <div>
        <h3 className="flex items-center text-base font-medium text-gray-800 mb-6 justify-start lg:justify-start dark:text-[#f0f5fa]">
          <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" />
          {copy.providerHeading}
        </h3>
        <div className="grid min-h-0 grid-flow-row grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 auto-rows-[4rem]">
          {providerItems.map(({ key, label, badge, icon: Icon, iconBg, colSpan }) => (
            <button
              key={key}
              type="button"
              aria-label={`${label} provider`}
              className={`flex h-16 min-w-0 items-center gap-2 rounded-2xl border bg-white px-3 shadow-sm transition hover:border-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 dark:bg-[#162033] dark:hover:border-[#324154] ${colSpan ?? ""}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-gray-700 dark:text-[#e4e7eb]">
                <span className={`flex-shrink-0 whitespace-nowrap ${key === "allam" ? "" : "truncate"}`}>
                  {label}
                </span>
                {badge ? (
                  <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-[#1f2b3b] dark:text-[#b7c2d0]">
                    {badge}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};