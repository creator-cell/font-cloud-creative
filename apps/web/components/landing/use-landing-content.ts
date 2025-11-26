"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart,
  Bot,
  Brain,
  CircleCheck,
  Globe,
  Globe2,
  LayoutGrid,
  Linkedin,
  Mail,
  MessageSquare,
  Share2,
  Sparkles,
  SquareCode,
  Target,
  Twitter,
  UsersRound,
  Wand2,
  Zap,
  Github,
} from "lucide-react";
import { translations } from "./translations";
import type { ContentFilter } from "./types";

const speedFeatureIcons: LucideIcon[] = [MessageSquare, Brain, Sparkles];
const creationFeatureIcons: LucideIcon[] = [
  Brain,
  MessageSquare,
  Sparkles,
  UsersRound,
  BarChart,
  SquareCode,
];

export const creationFeatureColors = [
  "bg-[#ebf3ff] text-[#2b80ff] dark:bg-[#1F324F] dark:text-[#5c9dff]",
  "bg-[#f7edff] text-[#ab45ff] dark:bg-[#2C2C4F] dark:text-[#d38cff]",
  "bg-[#e6faf3] text-[#00bc7d] dark:bg-[#1B3842] dark:text-[#38e1a4]",
  "bg-[#fff0e6] text-[#ff6a00] dark:bg-[#352F35] dark:text-[#ffa057]",
  "bg-[#ffebf5] text-[#f5339b] dark:bg-[#342A45] dark:text-[#ff70c0]",
  "bg-[#e6f8fc] text-[#00b7db] dark:bg-[#1B374B] dark:text-[#3fd4ef]",
];

export const useLandingContent = (
  language: "en" | "ar",
  activeContentFilter: ContentFilter
) => {
  const copy = useMemo(() => translations[language], [language]);

  const heroStats = copy.heroStats ?? [];
  const navItems = copy.nav ?? [];

  const speedFeatures =
    copy.speedFeatures?.map((feature, index) => ({
      ...feature,
      Icon: speedFeatureIcons[index] ?? Sparkles,
    })) ?? [];

  const creationFeatures =
    copy.creationFeatures?.map((feature, index) => ({
      ...feature,
      Icon: creationFeatureIcons[index] ?? Sparkles,
    })) ?? [];

  const providerItems = [
    {
      key: "openai",
      label: copy.providerOpenAI,
      icon: Bot,
      iconBg: "bg-sky-500",
      badge: copy.providerOpenAIBadge,
    },
    {
      key: "anthropic",
      label: copy.providerAnthropic,
      icon: Brain,
      iconBg: "bg-emerald-500",
      badge: copy.providerAnthropicBadge,
    },
    {
      key: "google",
      label: copy.providerGoogle,
      icon: Globe2,
      iconBg: "bg-purple-500",
    },
    {
      key: "open-source",
      label: copy.providerOpenSource,
      icon: Share2,
      iconBg: "bg-slate-500",
      colSpan: "sm:col-span-2 lg:col-span-1",
    },
    {
      key: "combo",
      label: copy.providerCombo,
      icon: LayoutGrid,
      iconBg: "bg-blue-500",
      badge: copy.providerComboBadge,
      colSpan: "sm:col-span-2",
    },
    {
      key: "allam",
      label: copy.providerAllam,
      icon: Wand2,
      iconBg: "bg-indigo-500",
      badge: copy.providerAllamBadge,
      colSpan: "sm:col-span-2 lg:col-span-3",
    },
  ];

  const contentFilters = copy.contentFilters ?? [];
  const activeScenario = copy.contentScenarios?.[activeContentFilter] ?? [];
  const orchestrateCards = copy.orchestrateCards ?? [];
  const newsroomActions = copy.newsroomActions ?? [];
  const finalData = copy.finalData ?? [];
  const statsTiles = copy.statsTiles ?? [];
  const pricingPlans = copy.pricingPlans ?? [];

  const socials = [
    { icon: Twitter, href: "/" },
    { icon: Linkedin, href: "/" },
    { icon: Github, href: "/" },
    { icon: Mail, href: "/" },
  ];

  const footerExtras = [
    { label: "English", icon: Globe, href: "/" },
    { label: "Status", href: "#" },
    { label: "API", href: "#" },
    { label: "Changelog", href: "#" },
  ];

  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  const getColor = (color: string) => {
    switch (color) {
      case "blue":
        return { text: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" };
      case "green":
        return { text: "text-green-500", bg: "bg-green-50", border: "border-green-200" };
      case "purple":
        return { text: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" };
      default:
        return { text: "", bg: "", border: "" };
    }
  };

  return {
    copy,
    navItems,
    heroStats,
    providerItems,
    speedFeatures,
    creationFeatures,
    contentFilters,
    activeScenario,
    orchestrateCards,
    newsroomActions,
    finalData,
    statsTiles,
    pricingPlans,
    socials,
    footerExtras,
    fadeIn,
    getColor,
  };
};
