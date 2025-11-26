"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { PricingPlan } from "./types";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Globe2,
  LayoutGrid,
  LineChart,
  MessageCircle,
  PlayCircle,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  PenLine,
  Brain,
  Search,
  Zap,
  Star,
  ArrowUpRight,
  CheckCircle,
  Play,
  Check,
  Crown,
  TrendingUp,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Globe,
  Dot,
  MessageSquare,
  SquareCode,
  BookOpen,
  UsersRound,
  BarChart,
  Code,
  CircleCheck,
} from "lucide-react";
import { translations } from "./translations";
import ChooseUrPlan from "../utils/ChooseUrPlan";
import EnterpriseSolution from "../utils/EnterpriseSolution";
import AskedQuestions from "../utils/AskedQuestions";
import TransformYourContent from "../utils/TransformYourContent";
import FooterFirstCard from "../utils/FooterFirstCard";
import LimitedTime from "../utils/LimitedTime";
import FooterSection from "../utils/FooterSection";
import TypeContent from "../helpers/TypeContent";
import Header from "../helpers/Header";
import WorkDemo from "../helpers/WorkDemo";
import Features from "../helpers/Features";
import PlatformOverview from "../helpers/PlatformOverview";
import DemoSection from "../utils/DemoSection";
import { ThemeToggle } from "../theme-toggle";

const contentFilterOrder = ["copy", "product", "social"] as const;
const whatsappLink = "https://wa.me/966504576354";
const speedFeatureIcons: LucideIcon[] = [MessageSquare, Brain, Sparkles];
const orchestrateIcons: LucideIcon[] = [LayoutGrid, Target];
const creationFeatureIcons: LucideIcon[] = [
  Brain,
  MessageSquare,
  Sparkles,
  UsersRound,
  BarChart,
  Code,
];

const creationFeatureColors = [
  "bg-[#ebf3ff] text-[#2b80ff] dark:bg-[#1F324F] dark:text-[#5c9dff]",
  "bg-[#f7edff] text-[#ab45ff] dark:bg-[#2C2C4F] dark:text-[#d38cff]",
  "bg-[#e6faf3] text-[#00bc7d] dark:bg-[#1B3842] dark:text-[#38e1a4]",
  "bg-[#fff0e6] text-[#ff6a00] dark:bg-[#352F35] dark:text-[#ffa057]",
  "bg-[#ffebf5] text-[#f5339b] dark:bg-[#342A45] dark:text-[#ff70c0]",
  "bg-[#e6f8fc] text-[#00b7db] dark:bg-[#1B374B] dark:text-[#3fd4ef]",
];

type ContentFilter = (typeof contentFilterOrder)[number];

const contentFilterIcons: Record<ContentFilter, LucideIcon> = {
  copy: PenLine,
  product: Server,
  social: Share2,
};

export const LandingPage = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [activeContentFilter, setActiveContentFilter] =
    useState<ContentFilter>("copy");

  const copy = useMemo(() => translations[language], [language]);
  // Explicitly typed all parameters and destructured properties to resolve TypeScript errors
  const navItems = (copy.nav || []).map(
    (item: { label: string; href: string }) => item
  );
  const providers = (copy.providerLabels || []).map((label: string) => label);
  const speedFeatures = (copy.speedFeatures || []).map(
    (feature: { title: string; description: string }, index: number) => ({
      ...feature,
      Icon: speedFeatureIcons[index] ?? Sparkles,
    })
  );
  const orchestrateCards = (copy.orchestrateCards || []).map(
    (
      card: {
        badge: string;
        title: string;
        description: string;
        bullets: string[];
      },
      index: number
    ) => ({
      ...card,
      Icon: orchestrateIcons[index] ?? LayoutGrid,
    })
  );
  const creationFeatures = (copy.creationFeatures || []).map(
    (feature: { title: string; description: string }, index: number) => ({
      ...feature,
      Icon: creationFeatureIcons[index] ?? Sparkles,
    })
  );
  const contentFilters = (copy.contentFilters || []).map(
    (filter: { id: ContentFilter; label: string }) => filter
  );
  const activeScenario = (
    copy.contentScenarios?.[activeContentFilter] || []
  ).map((item: string) => item);
  const newsroomActions = copy.newsroomActions || [];
  const finalData = (copy.finalData || []).map((action: string) => action);

  const statsTiles = copy.statsTiles || [];
  const providerItems = [
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

  const pricingPlans = (copy.pricingPlans || []) as PricingPlan[];
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  const getColor = (color: string) => {
    switch (color) {
      case "blue":
        return {
          text: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
        };
      case "green":
        return {
          text: "text-green-500",
          bg: "bg-green-50",
          border: "border-green-200",
        };
      case "purple":
        return {
          text: "text-purple-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
        };
      default:
        return { text: "", bg: "", border: "" };
    }
  };

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

  return (
    <div
      className="min-h-screen bg-white text-slate-900 dark:bg-[#0f1729]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Header language={language} setLanguage={setLanguage} copy={copy} />

      <main className=" flex w-full overflow-hidden flex-col gap-24 px-7 pb-0 py-4 md:py-8 xl:px-16 2xl:max-w-screen-2xl 2xl:mx-auto">
        <motion.section
          className="relative w-full text-gray-900"
          id="product"
          {...fadeIn(0.05)}
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <div
              className="absolute bottom-0 right-1/2 w-96 h-96 bg-sky-200 dark:bg-[#14263D] rounded-full mix-blend-multiply filter blur-xl animate-blob"
              style={{ animationDelay: "-2s" }}
            ></div>
            <div
              className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 dark:bg-[#14263D] rounded-full mix-blend-multiply filter blur-xl animate-blob"
              style={{ animationDelay: "-4s" }}
            ></div>
          </div>

          <motion.div
            className="relative z-10 w-full flex justify-center pt-8 sm:pt-0 pb-6 sm:pb-8"
            {...fadeIn()}
          >
            <div className="inline-flex justify-center items-center gap-2 sm:gap-1 border border-blue-200 bg-[#F3FAFE] rounded-md px-3 py-1 sm:px-3 text-xs text-blue-700 font-medium  whitespace-nowrap dark:bg-[#111e33] dark:border-[#183e5c]">
              <Sparkles
                className="h-3 w-3 text-[#0EA5E9] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              />
              <p className="text-[12px] sm:text-[10px] text-black whitespace-nowrap font-semibold dark:text-[#f2f6fa]">
                {copy.heroEyebrow}
              </p>
              <svg
                className="h-3 w-3 text-black flex-shrink-0 dark:text-[#f2f6fa]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 items-start">
            <div className="lg:text-left">
              <h1 className="text-4xl md:text-[4rem] font-bold leading-[1] mb-6 mt-4 md:mt-0 dark:text-[#f2f6fa]">
                {copy.heroTitlePrimary} <br />
                <span className="text-[#1D8FFF] inline-block md:text-[4rem]">
                  {copy.heroTitleHighlight}
                </span>
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

                <Link
                  href={whatsappLink}
                  target="_blank"
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-sky-100 transition-colors text-sm dark:bg-[#1a2438] dark:text-[#f2f6fa]"
                >
                  <Play className="h-4 w-4 mr-2" /> {copy.heroSecondaryCta}
                </Link>
              </div>

              <div className="flex flex-wrap justify-start lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm dark:text-[#93a2b8]">
                    {copy.heroToken}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 " />
                  <span className="text-sm dark:text-[#93a2b8]">
                    {copy.heroCard}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm dark:text-[#93a2b8]">
                    {copy.heroCancel}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-8 text-sm text-slate-700 dark:border-[#1f2b3b] dark:text-[#d7deea]">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>Average response under 2s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Batch generation ready in ~12s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Optimized orchestration across providers</span>
                </div>
              </div>

            </div>

            <motion.div className="space-y-6 md:mt-8 overflow-visible" {...fadeIn(0.2)}>
              <div>
                <h3 className="flex items-center text-base font-medium text-gray-800 mb-6 justify-start lg:justify-start dark:text-[#f0f5fa]">
                  <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" />{" "}
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
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />{" "}
                  {copy.providerCreate}
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-1.5 bg-white border  rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center gap-3 ">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 dark:bg-[#1a3047]">
                        <SquareCode />
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-[#f2f6fa]">
                        {copy.providerAd}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-1.5 bg-white border  rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-50 p-2 text-green-600 dark:bg-[#1a3047]">
                        <MessageSquare />
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-[#f2f6fa]">
                        {copy.providerSocial}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-1.5 bg-white border  rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-[#1a3047]">
                        <BookOpen />
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-[#f2f6fa]">
                        {copy.providerBlog}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        <motion.section
          className="space-y-6 pb-8 bg-white dark:bg-[#0F1729]"
          id="solutions"
          {...fadeIn(0.1)}
        >
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
              ></div>
            </div>

            {speedFeatures.map(
              (
                { title, description, Icon, iconColor, style }: { title: string; description: string; Icon: LucideIcon; iconColor?: string; style?: React.CSSProperties },
                index: number
              ) => (
                <motion.div
                  key={title}
                  className="relative rounded-2xl p-4 h-full flex flex-col justify-between dark:bg-[#162033] dark:border-[#1c3d57]"
                  style={{
                    ...style,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
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
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-[#e4e9ed]">
                          {title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground dark:text-[#657387]">
                          {description}
                        </p>
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
              )
            )}
          </div>
        </motion.section>
        <div>
          <motion.section>
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-4 dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:border-[#2a21445e]">
              <div className="flex justify-between items-center mb-6 ">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center justify-center rounded-lg p-1.5">
                    <Image
                      src={"/logo2.png"}
                      alt="Logo"
                      width={36}
                      height={36}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[#0A0A0A] text-sm font-semibold dark:text-[#f2f6fa]">
                      {copy.data.header.platformName}
                    </span>
                    <span className="text-xs text-[#64748B] dark:text-[#93a2b8]">
                      {copy.data.header.platformDescription}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-50 text-sky-900 px-3 py-0.5 rounded-full text-xs font-medium dark:text-[#e1e8f0] dark:bg-[#1e293b]">
                    {copy.data.header.demoLabel}
                  </span>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 dark:text-[#00bd72]"></span>
                    <span className="text-sky-900 text-sm font-medium dark:text-[#93a2b8]">
                      {copy.data.header.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row border-t dark:border-[#324154] border-[#e1e8f0] ">
                <div className="w-full md:w-[38%] border-b md:border-b-0 border-gray-200 pr-6 py-6 space-y-5 bg-white dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b]">
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-black mb-3 dark:text-[#f2f6fa]">
                      {copy.data.leftPanel.contentBrief.title}
                    </h3>
                    <div className="border border-gray-200 rounded-lg bg-[#fafbfc] p-3 text-sm text-gray-800 leading-relaxed pb-14 dark:bg-[#1e293b] dark:text-[#f2f6fa] dark:border-[#2e3b4f]">
                      {copy.data.leftPanel.contentBrief.example}
                    </div>
                    <div className="absolute -bottom-6 -left-12 bg-[#f0f6ff] dark:bg-[#172657] dark:border-[#1a3cb8] rounded-lg px-2 py-3 md:flex items-center gap-2 shadow-lg border border-[#bfdcff] hidden">
                      <TrendingUp className="w-4 h-4 text-[#1c5ffc] dark:text-[#145efc]" />
                      <div className="flex flex-col">
                        <span className="text-[#1c5ffc] font-medium text-xs dark:text-[#145efc]">
                          {copy.data.leftPanel.conversionBadge.percentage}
                        </span>
                        <span className="text-[#1c5ffc] text-xs dark:text-[#164cc9]">
                          {copy.data.leftPanel.conversionBadge.note}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 dark:text-[#f2f6fa]">
                      {copy.data.leftPanel.aiProvider.title}
                    </h3>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-[#f9fafb] text-[13px] dark:bg-[#1e293b] dark:border-[#1f2c40]">
                      <div className="bg-[#00bd7e] p-1.5 rounded-sm">
                        <Bot className="text-black" size={16} />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium dark:text-[#f2f6fa]">
                          {copy.data.leftPanel.aiProvider.name}
                        </p>
                        <p className="text-gray-500 text-[0.60rem] mt-0.5 dark:text-[#93a2b8]">
                          {copy.data.leftPanel.aiProvider.provider}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1">
                    <h3 className="text-sm font-semibold text-black mb-2 dark:text-[#f2f6fa]">
                      {copy.data.leftPanel.contentType.title}
                    </h3>
                    <div className="border border-gray-200 dark:bg-[#1e293b] dark:border-[#324154] dark:text-[#f2f6fa] rounded-lg bg-[#f9fafb] px-2 py-2.5 text-xs text-black">
                      {copy.data.leftPanel.contentType.type}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-black mb-2 dark:text-[#f2f6fa]">
                      {copy.data.leftPanel.toneStyle.title}
                    </h3>
                    <div className="flex gap-2 text-[.65rem]">
                      {copy.data.leftPanel.toneStyle.styles.map((style: string) => (
                        <span
                          key={style}
                          className="border items-center border-gray-200 rounded-full bg-[#f0f9ff] font-medium px-1.5 text-[#0c4a6e] text-xs dark:bg-[#1e293b] dark:text-[#e1e8f0]"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[62%] py-6">
                  <div className="flex items-center mb-3 justify-between">
                    <div className="text-sm font-bold text-gray-700 dark:text-[#f2f6fa]">
                      {copy.data.rightPanel.generatedContent.title}
                    </div>
                    <div className="flex items-center">
                      <Dot className="w-8 h-auto text-green-500 dark:text-[#0a7d60]" />
                      <div className="-ml-1 text-[.70rem] text-green-500 font-medium dark:text-[#008553]">
                        {copy.data.rightPanel.generatedContent.generating}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#edf7fc] border border-[#c3e7fa] rounded-lg p-5 items-center dark:bg-gradient-to-tl from-[#162640] to-[#1c2d45] dark:border-[#224a6b]">
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                        {copy.data.rightPanel.generatedContent.headline.label}
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 dark:text-[#f2f6fa]">
                      {copy.data.rightPanel.generatedContent.headline.content}
                    </h2>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                        {copy.data.rightPanel.generatedContent.bodyCopy.label}
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
                    </div>
                    <p className="text-sm text-[#65758c] mb-4 leading-relaxed dark:text-[#93a2b8]">
                      {copy.data.rightPanel.generatedContent.bodyCopy.content}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                        {
                          copy.data.rightPanel.generatedContent.callToAction
                            .label
                        }
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
                    </div>
                    <Button className="w-full bg-[#007bff] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2 dark:bg-gradient-to-l from-[#1167fa] to-[#28a9fa]">
                      {
                        copy.data.rightPanel.generatedContent.callToAction
                          .buttonText
                      }{" "}
                      <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
                    </Button>
                    <div className="border-b mt-6 dark:text-[#324154]"></div>
                    <div className="flex items-center gap-1 justify-between mt-5">
                      <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center dark:text-[#93a2b8]">
                        {copy.data.rightPanel.generatedContent.tokensUsed}
                      </div>
                      <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center dark:text-[#93a2b8]">
                        {copy.data.rightPanel.generatedContent.generatedIn}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="w-full bg-[#059ced] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2 dark:bg-gradient-to-l from-[#1167fa] to-[#28a9fa]">
                      <Play className="ml-1 w-3 h-3 font-bold text-white" />
                      {copy.data.rightPanel.actions.tryYourself}
                    </Button>

                    <Link
                      href={whatsappLink}
                      target="_blank"
                      className="w-[14rem] bg-white hover:bg-sky-100 text-sm font-medium py-2 rounded-md mt-2 text-black border border-[#e1e8f0] dark:bg-[#1c2a3d] dark:border-[#324154] dark:text-[#f2f6fa] flex items-center justify-center gap-1"
                    >
                      <Globe2 className="w-4 h-4" />
                      {copy.data.rightPanel.actions.watchDemo}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
        <motion.section
          className="space-y-10 bg-[#fafdff] dark:bg-[#0f1729]"
          id="resources"
          {...fadeIn(0.1)}
        >
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] py-1 px-3 rounded-lg dark:text-[#f2f6fa] dark:border-[#324154]">
              <Sparkles className="w-3 h-3 mr-1" />
              {copy.creationFeature}
            </span>
            <h2 className="text-[28px] sm:text-4xl  lg:text-5xl font-bold dark:text-[#f2f6fa]">
              {copy.creationTitle}
            </h2>
            <p className="text-xl text-muted-foreground md:text-lg max-w-3xl mx-auto dark:text-[#93a2b8]">
              {copy.creationSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {creationFeatures.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:bg-[#1e293b] dark:border-[#324154]"
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
                }}
                {...fadeIn(index * 0.15)}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-md ${
                    creationFeatureColors[index % creationFeatureColors.length]
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-4 text-xl font-normal text-slate-900 dark:text-[#f2f6fa]">
                  {title}
                </h3>
                <p className="mt-6 text-base leading-6 text-slate-600 dark:text-[#93a2b8]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        <motion.section {...fadeIn(0.1)} className="-mt-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div {...fadeIn(0.1, 20)}>
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-[#F0F9FF] rounded-full dark:bg-[#1E293B] dark:text-[#e1e8f0]">
                  {copy.newsOverview}
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f2f6fa]">
                  {copy.newsroomTitle}
                </h2>

                <p className="mt-4 text-lg text-[#65758c] leading-relaxed dark:text-[#93a2b8]">
                  {copy.newsroomSubtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {newsroomActions.map((action, index) => {
                  const FeatureIcon = action.Icon as LucideIcon;
                  return (
                    <motion.div
                      key={action.label}
                      className="p-4 flex items-center space-x-3 border border-slate-100 rounded-xl bg-white shadow-sm dark:bg-[#1e293b] dark:border-[#334357]"
                      {...fadeIn(0.1 + index * 0.1, 15)}
                    >
                      <FeatureIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />

                      <span className="text-sm font-medium text-slate-800 dark:text-[#f2f6fa]">
                        {action.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50"
              {...fadeIn(0.3)}
            >
              <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center">
                <img
                  src="/group.jpg"
                  alt="Office team working in an open-plan office."
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://placehold.co/800x600/f0f4f8/334155?text=Image+Placeholder";
                    target.alt = "Image Placeholder";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
        <motion.section
          className="pb-20 bg-[#fafdff] text-center dark:bg-[#0f1729]"
          {...fadeIn(0.2)}
        >
          <motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-[#f2f6fa]">
              {copy.TypeTitle}
            </h2>
            <p className="mt-4 text-gray-500 text-[17px] md:text-lg dark:text-[#93a2b8]">
              {copy.TypeDescription}
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {statsTiles.map((card, index) => {
              const { text, bg, border } = getColor(card.color || "");
              const Icon = card.Icon as LucideIcon;

              return (
                <motion.div
                  key={card.title}
                  {...fadeIn(index * 0.15, 20)}
                  className="rounded-2xl bg-white border border-gray-200 shadow-sm  transition-colors duration-300 cursor-pointer p-10 flex flex-col items-center text-center dark:bg-[#1e293b] dark:border-[#324154]"
                >
                  <div
                    className={`flex items-center justify-center h-16 w-16 rounded-full ${bg} mb-6 dark:${bg}`}
                  >
                    <Icon className={`h-8 w-8 ${text}`} />
                  </div>

                  <h3 className="text-lg md:text-lg font-semibold text-gray-900 dark:text-[#f2f6fa]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground text-xs leading-relaxed dark:text-[#93a2b8]">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
        <motion.section id="pricing" className="space-y-10" {...fadeIn(0.1)}>
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <div
              className="inline-flex justify-center items-center border py-0.5
                 px-2 mx-auto rounded-md border-slate-300 gap-1 dark:bg-[#0f1729]"
            >
              <Zap className="w-3 h-auto mr-1 dark:text-[#f2f6fa]" />
              <span className="text-xs font-medium dark:text-[#f2f6fa] dark:border-[#324154]">
                {copy.pricingHead}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-5xl dark:text-[#f2f6fa]">
              {copy.pricingTitle}
            </h2>
            <p className="text-base text-[#787F8F] md:text-xl dark:text-[#93a2b8]">
              {copy.pricingSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan, index) => {
              return (
                <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
                  <Card
                    className={`p-6 bg-white transition hover:-translate-y-1 shadow-lg dark:bg-[#1e293b] 
                                        ${
                                          plan.popular
                                            ? "shadow-2xl hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                                            : "border border-gray-300 hover:shadow-xl"
                                        }`}
                    style={
                      plan.popular
                        ? { borderWidth: "2px", borderColor: "#38bdf8" }
                        : { borderColor: "#EEEEEE" }
                    }
                  >
                    <CardHeader className="space-y-1 text-black">
                      <span>
                        {plan.logo && <plan.logo {...(plan.logoProps || {})} />}
                      </span>
                      <CardTitle className="flex flex-col items-center justify-center text-inherit text-xl text-black dark:text-black relative">
                        <span className="my-2 font-normal dark:text-[#f2f6fa]">
                          {plan.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {plan.popular && (
                            <span className="absolute -top-24 left-1/2 -translate-x-1/2 rounded-full border border-sky-300 bg-gradient-to-r from-[#09a0eb] to-[#0773f7] px-2 py-0.5 text-sm text-white">
                              {language === "ar"
                                ? "الأكثر طلبًا"
                                : "Most Popular"}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-3xl text-black mr-1 dark:text-[#f2f6fa]">
                            {plan.price}
                          </span>
                          <span className="text-[#65758c] text-base dark:text-[#93a2b8]">
                            {plan.priceValid}
                          </span>
                        </div>
                      </CardTitle>
                      <p className="text-sm text-[#65758c] text-center dark:text-[#93a2b8]">
                        {plan.description}
                      </p>
                      <div className="items-center mx-auto border border-slate-300 px-3 py-0.5 rounded-lg text-xs font-semibold text-[#0A0A0A] dark:border-[#324154]">
                        <span className="mr-1 dark:text-[#f2f6fa] dark:border-[#324154]">
                          {plan.tookens}
                        </span>
                        <span className="dark:text-[#f2f6fa]">
                          {" "}
                          {plan.month}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-black dark:text-black">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          className="flex items-start gap-2 text-black dark:text-[#f2f6fa]"
                          {...fadeIn(featureIndex * 0.08, 15)}
                        >
                          <Check className="mt-0.5 h-4 w-4 text-sky-500" />
                          {feature}
                        </motion.div>
                      ))}

                      {plan.boundary && (
                        <motion.div className="flex flex-col items-start gap-2 mt-3 border-t border-slate-300">
                          <span className="font-semibold text-gray-500 mt-3 text-xs dark:text-[#93a2b8]">
                            {plan.boundary}
                          </span>
                          <div className="flex flex-col gap-1 ">
                            {(plan.Limitations ?? []).map((limit, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2  text-gray-600 text-xs dark:text-[#93a2b8]"
                              >
                                <span>•</span>
                                {limit}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <Button
                        className={`w-full rounded-full border mt-4 ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#09a0eb] to-[#0773f7] border-none text-white hover:from-[#0773f7] hover:to-[#09a0eb] !mb-14"
                            : "bg-white text-black border border-slate-300 hover:bg-sky-200 hover:text-[#0b60af] dark:bg-[#243142] dark:border-[#324154] dark:text-[#f2f6fa]"
                        }`}
                        style={{ marginTop: "1.5rem" }}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.div {...fadeIn(0.1)}>
          <Card className="rounded-3xl border border-sky-300 bg-[#fafbfa] p-8 text-center text-slate-900 shadow-xl dark:border-transparent dark:bg-[#111a2e] dark:border-[#193a59]">
            <CardHeader className="">
              <div className="flex bg-[#dcf0fa]  justify-center items-center mx-auto w-16 h-16 rounded-full mt-2">
                <span className="text-[#0ea3e8] items-center">
                  {" "}
                  <Crown size={35} />
                </span>
              </div>
              <CardTitle className="text-2xl text-black font-bold mt-3 dark:text-[#f2f6fa]">
                {copy.enterpriseTitle}
              </CardTitle>
              <p className="text-base text-[slate-900] dark:text-[#93a2b8] max-w-[42rem] mx-auto">
                {copy.enterpriseSubtitle}
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4 text-slate-900 dark:text-slate-900 mt-6">
              <Link
                href={whatsappLink}
                target="_blank"
                className="rounded-full bg-white text-black hover:bg-sky-200 border border-slate-300 w-full sm:w-fit px-4 py-2 text-sm font-semibold dark:text-[#93a2b8] dark:bg-[#1c283d] dark:border-[#324154] flex items-center justify-center"
              >
                {copy.enterpriseCta}
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                className="rounded-full bg-gradient-to-r from-[#09a0eb] to-[#0773f7] text-white hover:bg-slate-800 w-full sm:w-fit px-4 py-2 text-sm font-semibold flex items-center justify-center"
              >
                {copy.enterpriseCta2}
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(0.1)} className=" cursor-default">
          <h2 className="text-center text-2xl font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
            {copy.FAQTitle}
          </h2>

          <div className="mx-auto mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
                {copy.FAQLeftOneTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
                {copy.FAQLeftRightDesc}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
                {copy.FAQLeftTwoTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
                {copy.FAQLeftRightDesc2}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
                {copy.FAQLeftThreeTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
                {copy.FAQLeftRightDesc3}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
                {copy.FAQLeftFourTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
                {copy.FAQLeftRightDesc4}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.section
          {...fadeIn()}
          className="relative bg-gradient-to-r from-[#0072ff] via-[#0099ff] to-[#00c6ff] text-[#FFFFFF] rounded-2xl py-10 px-6 md:px-8 my-10 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-3">
                {copy.finalCtaTitle} <br className="hidden md:block" />{" "}
                {copy.finalCtaTitle2}
              </h2>
              <p className="text-[#E6F1FC] mb-4 text-lg">
                {copy.finalCtaSubtitle}
              </p>

              <div className="grid sm:grid-cols-2 gap-2 mb-6 text-[#E6F1FC]">
                {finalData.map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-[#E6F1FC] w-4 h-4" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row">
                <Link
                  href="/signin?register=1"
                  className="flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-sky-400 transition hover:bg-white/90 sm:w-fit"
                >
                  <Zap className="mr-2 h-auto w-4" />
                  {copy.finalPrimaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={whatsappLink}
                  target="_blank"
                  className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit dark:bg-[#1c67d8] dark:text-[#f2f6fa] dark:border-[#324154] flex items-center justify-center"
                >
                  <Zap className="w-4 h-auto mr-2" />
                  {copy.finalSecondaryCta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative rounded-2xl bg-[#1e6ce3] p-5 shadow-lg">
                <img
                  src="/imgt.jpg"
                  alt="content creation"
                  className="rounded-xl w-[28rem] h-[16rem] object-cover"
                />

                <div className="absolute -top-4 -right-4 bg-white rounded-lg px-3 py-4   flex items-center gap-2 shadow">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  <div className="flex flex-col">
                    <span className="text-sky-400 font-bold">
                      {copy.finalSecondaryCtaPercentage}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {copy.finalSecondaryCtaSatisfaction}
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-4 bg-white rounded-lg px-4 py-5 flex items-center gap-2 shadow">
                  <Sparkles className="w-6 h-6 text-[#00bd7e]" />
                  <div className="flex flex-col">
                    <span className="text-[#00bd7e] font-extrabold">
                      {copy.finalMil}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {copy.finalGen}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...fadeIn(0.1)}>
          <motion.div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 bg-[#dcf3fc] dark:bg-[#132e47]  rounded-full py-1.5 px-3">
              <Sparkles className="text-[#2ea4e8] w-4 h-4 dark:text-[#39b2f7]" />
              <h3 className="text-sm font-semibold text-[#2ea4e8] dark:text-[#39b2f7]">
                {copy.LimitedTime}
              </h3>
            </div>
            <p className="text-[#65758c] mt-6 max-w-[42rem] mx-auto dark:text-[#93a2b8]">
              {copy.LimitedDes}
            </p>
          </motion.div>
        </motion.section>

        <footer className="mt-6 md:mt-8 -mx-6 space-y-10 border-t border-sky-100 bg-white px-6 py-10 text-sm text-slate-600 shadow-inner md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24 dark:bg-[#1e293b]">
          <div className="flex flex-col items-center gap-6 text-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-[#f1f2ed]"
            >
              <Image
                src="/logo2.png"
                alt="Front Cloud logo"
                width={28}
                height={28}
                className="mt-1"
              />
              Front Cloud
            </Link>
            <p className="text-base text-slate-500 max-w-4xl dark:text-[#93a2b8]">
              {copy.footerTagline}
            </p>

          </div>

          <div className="flex flex-col gap-4 border-t dark:border-[#324154] border-sky-100 pt-6 text-xs sm:text-sm text-[#65758c] md:flex-row md:items-center md:justify-between">
            <p className="text-center text-sm md:text-left dark:text-[#93a2b8]">
              {copy.footerLegal}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 cursor-pointer">
              {footerExtras.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex gap-2 items-center hover:text-black dark:text-[#93a2b8]"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
