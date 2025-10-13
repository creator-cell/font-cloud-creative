"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
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
  Users,
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
import HeroSection from "../helpers/HeroSection";
import Header from "../helpers/Header";
import WorkDemo from "../helpers/WorkDemo";
import Features from "../helpers/Features";
import PlatformOverview from "../helpers/PlatformOverview";
import DemoSection from "../utils/DemoSection";
import { ThemeToggle } from "../theme-toggle";

const contentFilterOrder = ["copy", "product", "social"] as const;
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
  "bg-[#ebf3ff] text-[#2b80ff]",
  "bg-[#f7edff] text-[#ab45ff]",
  "bg-[#e6faf3] text-[#00bc7d]",
  "bg-[#fff0e6] text-[#ff6a00]",
  "bg-[#ffebf5] text-[#f5339b]",
  "bg-[#e6f8fc] text-[#00b7db]",
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
  const heroStats = (copy.heroStats || []).map(
    (stat: { value: string; label: string }) => stat
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
  const newsroomActions = (copy.newsroomActions || []).map(
    (action: string) => action
  );
  const finalData = (copy.finalData || []).map((action: string) => action);

  const statsTiles = (copy.statsTiles || []).map(
    (tile: { value: string; label: string }) => tile
  );
  const statsTiles2 = (copy.statsTiles2 || []).map(
    (tile: { value: string; label: string; icon: string }) => tile
  );

  const pricingPlans = (copy.pricingPlans || []).map(
    (plan: {
      id: string;
      title: string;
      price: string;
      description: string;
      features: string[];
      cta: string;
      popular: boolean;
    }) => plan
  );
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
      className="relative min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-[#0f1729]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm text-slate-600 md:px-10 lg:px-16 xl:px-24">
          <Link
            href="/"
            className="flex items-center gap-3 text-base font-semibold text-slate-900"
          >
            <Image
              src="/logo.svg"
              alt="Front Cloud logo"
              width={60}
              height={85}
              className="h-12 w-auto"
              priority
            />
            Front Cloud Creative
          </Link>
          <nav className="flex flex-1 items-center justify-center gap-6 text-sm text-slate-600">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-sky-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() =>
                setLanguage((prev) => (prev === "en" ? "ar" : "en"))
              }
              className="rounded-full bg-sky-500 px-4 text-xs text-white transition hover:bg-sky-400"
            >
              <Globe2 className="mr-1 h-4 w-4" /> {copy.languageToggle}
            </Button>
            <Link
              href="/api/auth/signin?callbackUrl=%2Fdashboard"
              className="inline-flex"
            >
              <Button className="rounded-full bg-sky-500 px-5 text-white transition hover:bg-sky-400">
                {language === "ar" ? "تسجيل الدخول" : "Sign in"}
              </Button>
            </Link>
            <Link
              href="/api/auth/signin?callbackUrl=%2Fdashboard"
              className="inline-flex"
            >
              <Button className="bg-sky-500 px-4 text-white transition hover:bg-sky-400">
                {copy.heroPrimaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </header> */}
      {/* <Header /> */}
      <Header language={language} setLanguage={setLanguage} copy={copy} />

      <main className=" flex w-full flex-col gap-24 px-7 pb-0 pt-16 md:pt-20 xl:px-16 2xl:max-w-screen-2xl 2xl:mx-auto">
        {/* Done  */}
        <motion.section
          className="relative w-full text-gray-900"
          id="product"
          {...fadeIn(0.05)}
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <div
              className="absolute bottom-0 right-1/2 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
              style={{ animationDelay: "-2s" }}
            ></div>
            <div
              className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
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

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 items-center">
            <div className="lg:text-left bg-red-500k">
              <h1 className="text-4xl md:text-[4.5rem] font-bold leading-tight mb-6 mt-4 md:mt-0 dark:text-[#f2f6fa]">
                {copy.heroTitlePrimary} <br />
                <span className="text-[#1D8FFF] inline-block md:text-[4rem]">
                  {copy.heroTitleHighlight}
                </span>
              </h1>
              <p className="text-xl sm:text-xl text-muted-foreground mb-8 sm:mb-10">
                {copy.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link
                  href={"/api/auth/signin?callbackUrl=%2Fdashboard"}
                  target="_main"
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-3.5 text-white font-medium rounded-lg shadow-md transition-colors bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm"
                >
                  <Zap className="h-4 w-4 mr-2" /> {copy.heroPrimaryCta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>

                <button className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-sky-100 transition-colors text-sm">
                  <Play className="h-4 w-4 mr-2" /> {copy.heroSecondaryCta}
                </button>
              </div>

              <div className="flex flex-wrap justify-start lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{copy.heroToken}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{copy.heroCard}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{copy.heroCancel}</span>
                </div>
              </div>

              <div className="flex justify-between gap-12 border-t border-gray-200 pt-8">
                <div className="flex justify-between items-center w-full">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      className="flex flex-col items-start"
                      {...fadeIn(index * 0.15, 30)}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 ml-7">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Cards */}
            <motion.div className="space-y-6" {...fadeIn(0.2)}>
              <div>
                <h3 className="flex items-center text-base font-medium text-gray-800 mb-6 justify-start lg:justify-start dark:text-[#f0f5fa]">
                  <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" />{" "}
                  {copy.providerHeading}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white border rounded-xl shadow-sm dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center justify-center rounded-lg bg-[#00bc7d] p-2">
                      <Bot size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-[#e4e7eb]">
                      {copy.providerOpenAI}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white border  rounded-xl shadow-sm dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center justify-center  rounded-md bg-[#ff6a00] p-2">
                      <Brain size={20} className="text-white " />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-[#e4e7eb]">
                      {copy.providerAnthropic}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white border  rounded-xl shadow-sm dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center justify-center  rounded-md bg-[#2b80ff] p-2">
                      <Search size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-[#e4e7eb]">
                      {copy.providerGoogle}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white border  rounded-xl shadow-sm dark:bg-[#162033] dark:hover:border-[#324154]">
                    <div className="flex items-center justify-center  rounded-md bg-[#ab45ff] p-2">
                      <Zap size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-[#e4e7eb]">
                      {copy.providerOllama}
                    </span>
                  </div>
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

        {/* Done  */}
        <motion.section
          className="space-y-6 pb-8 bg-white"
          id="solutions"
          {...fadeIn(0.1)}
        >
          <motion.div
            className="text-center"
            {...fadeIn(0.05, 10)}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] px-1 rounded-md py-0.5">
              <Sparkles className="w-3 h-3 mr-1" />
              {copy.speedDemo}
            </span>
          </motion.div>

          <motion.div className="space-y-4 text-center" {...fadeIn(0.1, 20)}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {copy.speedTitle}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500 text-3xl sm:text-4xl lg:text-5xl">
                {copy.speedTitleSecond}
              </span>
            </h1>
            <p className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
              {copy.speedSubtitle}
            </p>
          </motion.div>

          <div className="relative grid gap-6 md:grid-cols-3">
            <div className="absolute inset-0 z-0 opacity-20">
              <div
                className="absolute -bottom-20 left-[45%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
                style={{ animationDelay: "-2s" }}
              ></div>
            </div>

            {speedFeatures.map(
              ({ title, description, Icon, iconColor, style }, index) => (
                <motion.div
                  key={title}
                  className="relative rounded-2xl p-4 h-full flex flex-col justify-between"
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
                            ? "bg-[#e6f6fc] "
                            : iconColor === "text-emerald-600"
                              ? "bg-[#e6faf3] "
                              : "bg-[#f1ebff] "
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold text-slate-900">
                          {title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index === 2 && (
                    <div className="absolute -top-1 right-16 p-4 rounded-xl bg-[#ebfcf4] border border-green-300 shadow-lg translate-x-1/2 -translate-y-1/2 hidden md:block">
                      <div className="flex items-center text-emerald-600">
                        <Check className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {copy.speedContent}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-500 mt-0.5 whitespace-nowrap">
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-4">
              <div className="flex justify-between items-center mb-6">
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
                    <span className="text-[#0A0A0A] text-sm font-semibold">
                      {copy.data.header.platformName}
                    </span>
                    <span className="text-xs text-[#64748B] ">
                      {copy.data.header.platformDescription}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-50 text-sky-900 px-3 py-0.5 rounded-full text-xs font-medium">
                    {copy.data.header.demoLabel}
                  </span>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-sky-900 text-sm font-medium">
                      {copy.data.header.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row border-t border-[#e1e8f0]">
                <div className="w-full md:w-[38%] border-b md:border-b-0 border-gray-200 pr-6 py-6 space-y-5 bg-white">
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-black mb-3">
                      {copy.data.leftPanel.contentBrief.title}
                    </h3>
                    <div className="border border-gray-200 rounded-lg bg-[#fafbfc] p-3 text-sm text-gray-800 leading-relaxed pb-14">
                      {copy.data.leftPanel.contentBrief.example}
                    </div>
                    <div className="absolute -bottom-6 -left-12 bg-[#f0f6ff] rounded-lg px-2 py-3 md:flex items-center gap-2 shadow-lg border border-[#bfdcff] hidden">
                      <TrendingUp className="w-4 h-4 text-[#1c5ffc]" />
                      <div className="flex flex-col">
                        <span className="text-[#1c5ffc] font-medium text-xs">
                          {copy.data.leftPanel.conversionBadge.percentage}
                        </span>
                        <span className="text-[#1c5ffc] text-xs">
                          {copy.data.leftPanel.conversionBadge.note}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      {copy.data.leftPanel.aiProvider.title}
                    </h3>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-[#f9fafb] text-[13px]">
                      <div className="bg-[#00bd7e] p-1.5 rounded-sm">
                        <Bot className="text-black" size={16} />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          {copy.data.leftPanel.aiProvider.name}
                        </p>
                        <p className="text-gray-500 text-[0.60rem] mt-0.5">
                          {copy.data.leftPanel.aiProvider.provider}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1">
                    <h3 className="text-sm font-semibold text-black mb-2">
                      {copy.data.leftPanel.contentType.title}
                    </h3>
                    <div className="border border-gray-200 rounded-lg bg-[#f9fafb] px-2 py-2.5 text-xs text-black">
                      {copy.data.leftPanel.contentType.type}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-black mb-2">
                      {copy.data.leftPanel.toneStyle.title}
                    </h3>
                    <div className="flex gap-2 text-[.65rem]">
                      {copy.data.leftPanel.toneStyle.styles.map((style) => (
                        <span
                          key={style}
                          className="border items-center border-gray-200 rounded-full bg-[#f0f9ff] font-medium px-1.5 text-[#0c4a6e] text-xs"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[62%] py-6">
                  <div className="flex items-center mb-3 justify-between">
                    <div className="text-sm font-bold text-gray-700">
                      {copy.data.rightPanel.generatedContent.title}
                    </div>
                    <div className="flex items-center">
                      <Dot className="w-8 h-auto text-green-500" />
                      <div className="-ml-1 text-[.70rem] text-green-500 font-medium">
                        {copy.data.rightPanel.generatedContent.generating}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#edf7fc] border border-[#c3e7fa] rounded-lg p-5 items-center">
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                        {copy.data.rightPanel.generatedContent.headline.label}
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                      {copy.data.rightPanel.generatedContent.headline.content}
                    </h2>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                        {copy.data.rightPanel.generatedContent.bodyCopy.label}
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                    </div>
                    <p className="text-sm text-[#65758c] mb-4 leading-relaxed">
                      {copy.data.rightPanel.generatedContent.bodyCopy.content}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                        {
                          copy.data.rightPanel.generatedContent.callToAction
                            .label
                        }
                      </div>
                      <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                    </div>
                    <Button className="w-full bg-[#007bff] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2">
                      {
                        copy.data.rightPanel.generatedContent.callToAction
                          .buttonText
                      }{" "}
                      <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
                    </Button>
                    <div className="border-b mt-6"></div>
                    <div className="flex items-center gap-1 justify-between mt-5">
                      <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center">
                        {copy.data.rightPanel.generatedContent.tokensUsed}
                      </div>
                      <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center">
                        {copy.data.rightPanel.generatedContent.generatedIn}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="w-full bg-[#059ced] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2">
                      <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
                      {/* Try It Yourself */}
                      {copy.data.rightPanel.actions.tryYourself}
                    </Button>

                    <Button
                      className="w-[14rem] bg-white hover:bg-sky-100  text-sm font-medium py-2
                    rounded-md mt-2 text-black border border-[#e1e8f0]"
                    >
                      <div className="flex items-center gap-1">
                        <div>
                          <Globe2 className="w-4 h-4" />
                        </div>
                        {copy.data.rightPanel.actions.watchDemo}
                        {/* Watch Full Demo */}
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.section
          className="space-y-10 bg-[#fafdff]"
          id="resources"
          {...fadeIn(0.1)}
        >
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] py-1 px-3 rounded-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              {copy.creationFeature}
            </span>
            <h2 className="text-[28px] sm:text-4xl  lg:text-5xl font-bold">
              {copy.creationTitle}
            </h2>
            <p className="text-xl text-muted-foreground md:text-lg max-w-3xl mx-auto">
              {copy.creationSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {creationFeatures.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm"
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
                <h3 className="mt-4 text-xl font-normal text-slate-900">
                  {title}
                </h3>
                <p className="mt-6 text-base leading-6 text-slate-600">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeIn(0.1)}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div {...fadeIn(0.1, 20)}>
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-[#F0F9FF] rounded-full">
                  {copy.newsOverview}
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {copy.newsroomTitle}
                </h2>

                <p className="mt-4 text-lg text-[#65758c] leading-relaxed">
                  {copy.newsroomSubtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {newsroomActions.map((action, index) => {
                  const FeatureIcon = action.Icon as LucideIcon;
                  return (
                    <motion.div
                      key={action.label}
                      className="p-4 flex items-center space-x-3 border border-slate-100 rounded-xl bg-white shadow-sm"
                      {...fadeIn(0.1 + index * 0.1, 15)}
                    >
                      <FeatureIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />

                      <span className="text-sm font-medium text-slate-800">
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
          className="pb-20 bg-[#fafdff] text-center"
          {...fadeIn(0.2)}
        >
          <motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {copy.TypeTitle}
            </h2>
            <p className="mt-4 text-gray-500 text-[17px] md:text-lg">
              {copy.TypeDescription}
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {statsTiles.map((card, index) => {
              const { text, bg, border } = getColor(card.color);
              const Icon = card.Icon as LucideIcon;

              return (
                <motion.div
                  key={card.title}
                  {...fadeIn(index * 0.15, 20)}
                  className="rounded-2xl bg-white border border-gray-200 shadow-sm  transition-colors duration-300 cursor-pointer p-10 flex flex-col items-center text-center"
                >
                  <div
                    className={`flex items-center justify-center h-16 w-16 rounded-full ${bg} mb-6`}
                  >
                    <Icon className={`h-8 w-8 ${text}`} />
                  </div>

                  <h3 className="text-lg md:text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground text-xs leading-relaxed">
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
                 px-2 mx-auto rounded-md border-slate-300 gap-1"
            >
              <Zap className="w-3 h-auto mr-1" />
              <span className="text-xs font-medium">{copy.pricingHead}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">
              {copy.pricingTitle}
            </h2>
            <p className="text-base text-[#787F8F] md:text-xl">
              {copy.pricingSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan, index) => {
              return (
                <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
                  <Card
                    className={`p-6 bg-white transition hover:-translate-y-1 shadow-lg dark:bg-white dark:text-black 
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
                        <span className="my-2 font-normal">{plan.title}</span>
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
                          <span className="text-3xl text-black mr-1">
                            {plan.price}
                          </span>
                          <span className="text-[#65758c] text-base">
                            {plan.priceValid}
                          </span>
                        </div>
                      </CardTitle>
                      <p className="text-sm text-[#65758c] text-center">
                        {plan.description}
                      </p>
                      <div className="items-center mx-auto border border-slate-300 px-3 py-0.5 rounded-lg text-xs font-semibold text-[#0A0A0A]">
                        <span className="mr-1">{plan.tookens}</span>
                        <span> {plan.month}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-black dark:text-black">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          className="flex items-start gap-2 text-black"
                          {...fadeIn(featureIndex * 0.08, 15)}
                        >
                          <Check className="mt-0.5 h-4 w-4 text-sky-500" />
                          {feature}
                        </motion.div>
                      ))}

                      {plan.boundary && (
                        <motion.div className="flex flex-col items-start gap-2 mt-3 border-t border-slate-300">
                          <span className="font-semibold text-gray-500 mt-3 text-xs">
                            {plan.boundary}
                          </span>
                          <div className="flex flex-col gap-1 ">
                            {plan.Limitations.map((limit, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2  text-gray-600 text-xs"
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
                            : "bg-white text-black border border-slate-300 hover:bg-sky-200 hover:text-[#0b60af] "
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
          <Card className="rounded-3xl border border-sky-300 !bg-gradient-to-r !from-[#fafbfc] !to-[#f0f6ff] p-8 text-center text-slate-900 shadow-xl dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60 dark:text-slate-900">
            <CardHeader className="">
              <div className="flex bg-[#dcf0fa] justify-center items-center mx-auto w-16 h-16 rounded-full mt-2">
                <span className="text-[#0ea3e8] items-center">
                  {" "}
                  <Crown size={35} />
                </span>
              </div>
              <CardTitle className="text-2xl text-black font-bold mt-3">
                {copy.enterpriseTitle}
              </CardTitle>
              <p className="text-base text-[slate-900] dark:text-[#65758c] max-w-[42rem] mx-auto">
                {copy.enterpriseSubtitle}
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4 text-slate-900 dark:text-slate-900 mt-6">
              <Button
                size="lg"
                className="rounded-full bg-white  text-black hover:bg-sky-200 border border-slate-300 w-full sm:w-fit"
              >
                {copy.enterpriseCta}
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-[#09a0eb] to-[#0773f7] text-white hover:bg-slate-800 w-full sm:w-fit"
              >
                {copy.enterpriseCta2}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(0.1)} className=" cursor-default">
          <h2 className="text-center text-2xl font-semibold text-[#0A0A0A]">
            {copy.FAQTitle}
          </h2>

          <div className="mx-auto mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A]">
                {copy.FAQLeftOneTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {copy.FAQLeftRightDesc}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A]">
                {copy.FAQLeftTwoTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {copy.FAQLeftRightDesc2}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A]">
                {copy.FAQLeftThreeTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {copy.FAQLeftRightDesc3}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[#0A0A0A]">
                {copy.FAQLeftFourTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
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
            {/* Left Section */}
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
                <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit">
                  <Zap className="w-4 h-auto mr-2" />
                  {copy.finalPrimaryCta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit">
                  <Zap className="w-4 h-auto mr-2" />
                  {copy.finalSecondaryCta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Section */}
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

        <motion.section {...fadeIn(0.1)} className="bg-[#f5fbff]">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            {statsTiles2.map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  className="rounded-xl bg-white shadow-md py-5 px-8 hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex flex-col items-center space-y-4 mt-1">
                    <div className="bg-sky-100 rounded-full text-sky-500 p-3">
                      <stat.Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.description}
                    </div>
                    <div className="text-gray-600">{stat.title}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...fadeIn(0.1)}>
          <motion.div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 bg-[#dcf3fc] rounded-full py-1.5 px-3">
              <Sparkles className="text-[#2ea4e8] w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#2ea4e8]">
                {copy.LimitedTime}
              </h3>
            </div>
            <p className="text-[#65758c] mt-6 max-w-[42rem] mx-auto">
              {copy.LimitedDes}
            </p>
          </motion.div>
        </motion.section>

        <footer className="-mx-6 space-y-10 border-t border-sky-100 bg-white px-6 py-8 text-sm text-slate-600 shadow-inner md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-5 gap-10 md:gap-16">
            <div className="max-w-sm space-y-3 text-center md:text-left">
              <Link
                href="/"
                className="flex justify-start items-center gap-2 text-lg font-semibold text-slate-900"
              >
                <Image
                  src="/logo2.png"
                  alt="Front Cloud logo"
                  width={20}
                  height={20}
                />
                Front Cloud Creative
              </Link>
              <p className="text-base text-slate-500 mt-2 text-start">
                {copy.footerTagline}
              </p>

              <div className="flex justify-start items-center gap-5 !mt-7">
                {socials.map(({ icon: Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sky-200 transition"
                  >
                    <Icon className="w-5 h-5 text-slate-700 hover:text-black" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-[5rem] text-start md:text-left md:mx-0">
              {Object.values(copy.footerLinks).map((group) => {
                return (
                  <div key={group.heading} className="space-y-3">
                    <p className="text-base font-semibold text-slate-900">
                      {group.heading}
                    </p>
                    <ul className="space-y-3 text-sm text-slate-500">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="transition hover:text-black"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-sky-100 pt-6 text-xs sm:text-sm text-[#65758c] md:flex-row md:items-center md:justify-between">
            <p className="text-center text-sm md:text-left">
              {copy.footerLegal}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 cursor-pointer">
              {footerExtras.map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex gap-2 items-center hover:text-black"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3FAFE] border border-sky-100 p-6 sm:p-8 rounded-xl text-center sm:text-left">
            <div className="flex flex-col justify-start items-start">
              <h1 className="text-black font-semibold text-base">
                Stay updated
              </h1>
              <p className="text-sm mt-1">
                Get the latest updates about new features and AI improvements.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-row justify-center sm:justify-end items-center gap-3">
              <input
                type="email"
                placeholder={copy.footerInputPlaceholder}
                className="rounded-lg border border-[#e1e8f0] bg-white px-4 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none h-10"
              />
              <button className="rounded-lg bg-sky-500 px-5 text-white hover:bg-sky-400 py-2.5 font-semibold flex items-center justify-center">
                {copy.footerBottomCta}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
