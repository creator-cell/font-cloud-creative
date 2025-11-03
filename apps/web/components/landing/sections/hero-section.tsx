"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  CircleCheck,
  LayoutGrid,
  MessageSquare,
  Play,
  Server,
  Sparkles,
  SquareCode,
  Target,
  Users,
  UsersRound,
  Wand2,
  Zap,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type HeroSectionProps = {
  copy: Record<string, any>;
  heroStats: Array<{ value: string; label: string }>;
  providerItems: Array<{
    key: string;
    label: string;
    icon: LucideIcon;
    iconBg: string;
    badge?: string;
    colSpan?: string;
  }>;
  speedFeatures: Array<{
    title: string;
    description: string;
    iconColor?: string;
    style?: Record<string, string>;
    Icon: LucideIcon;
  }>;
  fadeIn: (delay?: number, offset?: number) => unknown;
};

export const HeroSection = ({
  copy,
  heroStats,
  providerItems,
  speedFeatures,
  fadeIn,
}: HeroSectionProps) => (
  <motion.section className="relative w-full text-gray-900" id="product" {...fadeIn(0.05)}>
    <div className="absolute inset-0 z-0 opacity-20">
      <div
        className="absolute bottom-0 right-1/2 w-96 h-96 bg-sky-200 dark:bg-[#14263D] rounded-full mix-blend-multiply filter blur-xl animate-blob"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 dark:bg-[#14263D] rounded-full mix-blend-multiply filter blur-xl animate-blob"
        style={{ animationDelay: "-4s" }}
      />
    </div>

    <motion.div className="relative z-10 w-full flex justify-center pt-8 sm:pt-0 pb-6 sm:pb-8" {...fadeIn()}>
      <div className="inline-flex justify-center items-center gap-2 sm:gap-1 border border-blue-200 bg-[#F3FAFE] rounded-md px-3 py-1 sm:px-3 text-xs text-blue-700 font-medium whitespace-nowrap dark:bg-[#111e33] dark:border-[#183e5c]">
        <Sparkles className="h-3 w-3 text-[#0EA5E9] flex-shrink-0" />
        <p className="text-[12px] sm:text-[10px] text-black whitespace-nowrap font-semibold dark:text-[#f2f6fa]">
          {copy.heroEyebrow}
        </p>
        <svg className="h-3 w-3 text-black flex-shrink-0 dark:text-[#f2f6fa]" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.div>

    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 items-start">
      <div className="lg:text-left">
        <h1 className="text-4xl md:text-[4rem] font-bold leading-[1] mb-6 mt-4 md:mt-0 dark:text-[#f2f6fa]">
          {copy.heroTitlePrimary} <br />
          <span className="text-[#1D8FFF] inline-block md:text-[4rem]">{copy.heroTitleHighlight}</span>
        </h1>
        <p className="text-xl sm:text-xl text-muted-foreground mb-8 sm:mb-10 dark:text-[#93a2b8]">
          {copy.heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
          <Link
            href="/signin?register=1"
            className="flex items-center justify-center w-full sm:w-auto px-4 py-3.5 text-white font-medium rounded-lg shadow-md transition-colors bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm"
          >
            <Zap className="h-4 w-4 mr-2" /> {copy.heroPrimaryCta}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>

          <button className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-sky-100 transition-colors text-sm dark:bg-[#1a2438] dark:text-[#f2f6fa]">
            <Play className="h-4 w-4 mr-2" /> {copy.heroSecondaryCta}
          </button>
        </div>

        <div className="flex flex-wrap justify-start lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
          <HighlightBadge label={copy.heroToken} />
          <HighlightBadge label={copy.heroCard} />
          <HighlightBadge label={copy.heroCancel} />
        </div>

        <div className="flex justify-between gap-12 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center w-full">
            {heroStats.map((stat, index) => (
              <motion.div key={stat.label} className="flex flex-col items-start" {...fadeIn(index * 0.15, 30)}>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-[#f2f6fa]">{stat.value}</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7 dark:text-[#93a2b8]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div className="space-y-6 md:mt-8 overflow-visible" {...fadeIn(0.2)}>
        <div>
          <h3 className="flex items-center text-base font-medium text-gray-800 mb-6 justify-start lg:justify-start dark:text-[#f0f5fa]">
            <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" /> {copy.providerHeading}
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
                  <span className={`flex-shrink-0 whitespace-nowrap ${key === "allam" ? "" : "truncate"}`}>{label}</span>
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

        <div>
          <h3 className="flex items-center text-base font-medium text-gray-800 mb-6 justify-start lg:justify-start dark:text-[#f0f5fa]">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" /> {copy.providerCreate}
          </h3>
          <div className="grid gap-4">
            <ProviderAction label={copy.providerAd} Icon={SquareCode} />
            <ProviderAction label={copy.providerSocial} Icon={MessageSquare} />
            <ProviderAction label={copy.providerBlog} Icon={BookOpen} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:bg-[#162033] dark:border-[#1f2c40]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-[#93a2b8]">{copy.providerDescription}</p>
              <p className="text-xs text-gray-400 mt-1 dark:text-[#65758c]">{copy.providerViewAll}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </motion.div>
    </div>

    <motion.section className="space-y-6 pb-8 bg-white dark:bg-[#0F1729]" id="solutions" {...fadeIn(0.1)}>
      <motion.div className="text-center" {...fadeIn(0.05, 10)} viewport={{ once: true }}>
        <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] px-1 rounded-md py-0.5 dark:bg-[#0f1a2b] dark:text-[#f2f6fa] dark:border-[#324154]">
          <Sparkles className="w-3 h-3 mr-1" />
          {copy.speedDemo}
        </span>
      </motion.div>

      <motion.div className="space-y-4 text-center" {...fadeIn(0.1, 20)}>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#f2f6fa]">
          {copy.speedTitle}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500 text-3xl sm:text-4xl lg:text-5xl">
            {copy.speedTitleSecond}
          </span>
        </h1>
        <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground dark:text-[#93a2b8]">
          {copy.speedSubtitle}
        </p>
      </motion.div>

      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute -bottom-20 left-[45%] w-96 h-96 bg-sky-200 dark:bg-sky-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "-2s" }}
          />
        </div>
        {speedFeatures.map(({ title, description, Icon, iconColor, style }, index) => (
          <motion.div
            key={title}
            className="relative rounded-2xl p-4 h-full flex flex-col justify-between dark:bg-[#162033] dark:border-[#1c3d57]"
            style={{
              ...style,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            }}
            {...fadeIn(index * 0.2)}
          >
            <div>
              <div className="flex items-start space-x-3 mb-4">
                <div
                  className={`p-2.5 rounded-md ${
                    iconColor === "text-sky-600"
                      ? "bg-[#e6f6fc] dark:bg-[#1a3047]"
                      : iconColor === "text-emerald-600"
                        ? "bg-[#e6faf3] dark:bg-[#15313b]"
                        : "bg-[#f1ebff] dark:bg-[#252948]"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-[#e4e9ed]">{title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-[#657387]">{description}</p>
                </div>
              </div>
            </div>
            {index === 2 && (
              <div className="absolute -top-1 right-16 p-4 rounded-xl bg-[#ebfcf4] border border-green-300 shadow-lg translate-x-1/2 -translate-y-1/2 hidden md:block dark:bg-[#002b21]">
                <div className="flex items-center text-emerald-600">
                  <CircleCheck className="w-5 h-5 mr-1 dark:text-[#009966]" />
                  <span className="text-sm font-semibold whitespace-nowrap dark:text-[#009966]">
                    {copy.speedContent}
                  </span>
                </div>
                <p className="text-xs ml-6 text-emerald-500 mt-0.5 whitespace-nowrap dark:text-[#009966]">
                  {copy.speedReady}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  </motion.section>
);

const HighlightBadge = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    <CheckCircle className="h-4 w-4 text-blue-500" />
    <span className="text-sm dark:text-[#93a2b8]">{label}</span>
  </div>
);

const ProviderAction = ({ label, Icon }: { label: string; Icon: LucideIcon }) => (
  <div className="flex items-center justify-between p-1.5 bg-white border rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer dark:bg-[#162033] dark:hover:border-[#324154]">
    <div className="flex items-center gap-3 ">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 dark:bg-[#1a3047]">
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-semibold text-gray-700 dark:text-[#f2f6fa]">{label}</span>
    </div>
    <ArrowRight className="h-4 w-4 text-gray-400" />
  </div>
);

