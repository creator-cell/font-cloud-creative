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
} from "lucide-react";
import { translations } from "./translations";
import ChooseUrPlan from "../utils/ChooseUrPlan";

const contentFilterOrder = ["copy", "product", "social"] as const;
const speedFeatureIcons: LucideIcon[] = [Clock, Sparkles, Wand2];
const orchestrateIcons: LucideIcon[] = [LayoutGrid, Target];
const creationFeatureIcons: LucideIcon[] = [
  Bot,
  LayoutGrid,
  ShieldCheck,
  LineChart,
  MessageCircle,
  Server,
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
  const statsTiles = (copy.statsTiles || []).map(
    (tile: { value: string; label: string }) => tile
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
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white text-slate-900"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur">
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
      </header>

      <main className="relative mx-auto flex w-full flex-col gap-24 px-6 pb-0 pt-32 md:px-10 lg:px-16 xl:px-24">
        {/* <ChooseUrPlan /> */}

        {/* 1st one */}
        <motion.section
          id="product"
          className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"
          {...fadeIn(0.05)}
        >
          <motion.div className="space-y-8" {...fadeIn()}>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-100/80 px-4 py-1 text-xs uppercase tracking-[0.25em] text-sky-600">
              <Sparkles className="h-3.5 w-3.5" /> {copy.heroEyebrow}
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                {copy.heroTitlePrimary}{" "}
                <span className="bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent">
                  {copy.heroTitleHighlight}
                </span>
              </h1>
              <p className="text-base text-slate-600 md:text-lg">
                {copy.heroDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/api/auth/signin?callbackUrl=%2Fdashboard"
                className="inline-flex"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-sky-500 px-8 text-white transition hover:-translate-y-1 hover:bg-sky-400"
                >
                  {copy.heroPrimaryCta}
                </Button>
              </Link>
              <Button
                size="lg"
                className="rounded-full bg-sky-500 px-8 text-white transition hover:-translate-y-1 hover:bg-sky-400"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> {copy.heroSecondaryCta}
              </Button>
              <Link
                href="#contact"
                className="flex items-center gap-2 text-sm text-sky-600 transition hover:text-sky-500"
              >
                {copy.heroTertiaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
                  {...fadeIn(index * 0.15, 30)}
                >
                  <p className="text-2xl font-semibold text-sky-600">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="border border-white bg-white p-6 text-slate-900 shadow-xl dark:border-transparent dark:bg-white dark:text-slate-900"
            {...fadeIn(0.2)}
          >
            <CardHeader className="space-y-3">
              <CardTitle className="text-lg text-slate-900">
                {copy.providerHeading}
              </CardTitle>
              <p className="text-sm text-slate-900">
                {copy.providerDescription}
              </p>
            </CardHeader>
            <CardContent className="space-y-5 text-slate-900">
              <div className="flex flex-wrap gap-2">
                {providers.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-4 py-1 text-xs text-sky-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {language === "ar" ? "مركز التحكم" : "Control Center"}
                </p>
                <div className="mt-3 space-y-3 text-sm text-slate-900">
                  <div className="flex items-center justify-between">
                    <span>GPT-4o</span>
                    <span className="text-xs text-sky-600">Live</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Claude 3</span>
                    <span className="text-xs text-sky-600">30s ETA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gemini Advanced</span>
                    <span className="text-xs text-sky-600">Ready</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        </motion.section>
        {/* 1st one */}

        {/* 2nd one */}
        <motion.section className="space-y-10" id="solutions" {...fadeIn(0.1)}>
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              {copy.speedTitle}
            </h2>
            <p className="text-base text-slate-600 md:text-lg">
              {copy.speedSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {speedFeatures.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
                {...fadeIn(index * 0.2)}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* 2nd one */}

        {/* 3rd */}
        <motion.section className="grid gap-6 lg:grid-cols-2" {...fadeIn(0.1)}>
          {orchestrateCards.map(
            ({ badge, title, description, bullets, Icon }, index) => (
              <motion.div key={title} {...fadeIn(index * 0.2)}>
                <Card className="border border-white bg-white p-6 text-slate-900 shadow-lg dark:border-transparent dark:bg-white dark:text-slate-900">
                  <CardHeader className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs text-sky-600">
                      <Icon className="h-4 w-4" /> {badge}
                    </span>
                    <CardTitle className="text-2xl text-slate-900">
                      {title}
                    </CardTitle>
                    <p className="text-sm text-slate-900">{description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-900">
                    {bullets.map((bullet, bulletIndex) => (
                      <motion.div
                        key={bullet}
                        className="flex items-start gap-3 text-sm text-sky-600"
                        {...fadeIn(bulletIndex * 0.1, 20)}
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" />
                        <span className="text-sky-600">{bullet}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </motion.section>
        {/* 3rd */}

        {/* 4th  */}
        <motion.section className="space-y-10" id="resources" {...fadeIn(0.1)}>
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              {copy.creationTitle}
            </h2>
            <p className="text-base text-slate-600 md:text-lg">
              {copy.creationSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {creationFeatures.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
                {...fadeIn(index * 0.15)}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* 4th  */}

        {/* 5th */}
        <motion.section
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          {...fadeIn(0.1)}
        >
          <motion.div {...fadeIn(0.1)}>
            <Card className="rounded-3xl border border-white bg-gradient-to-br from-sky-100 via-white to-sky-50 p-6 shadow-lg dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-black">
                  {copy.newsroomTitle}
                </CardTitle>
                <p className="mt-3 text-sm text-black">
                  {copy.newsroomSubtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-900">
                <div className="flex flex-wrap gap-3">
                  {newsroomActions.map((action, index) => (
                    <motion.span
                      key={action}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-4 py-1 text-xs text-sky-600"
                      {...fadeIn(index * 0.1, 20)}
                    >
                      {action}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  className="rounded-2xl border border-sky-100 bg-sky-50 p-5"
                  {...fadeIn(0.2, 20)}
                >
                  <p className="text-sm text-slate-700">
                    {copy.newsroomHighlightTitle}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {copy.newsroomHighlightBody}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            className="flex flex-col justify-between gap-6 text-slate-900"
            {...fadeIn(0.2)}
          >
            <motion.div
              className="rounded-3xl border border-white bg-gradient-to-br from-sky-100 via-white to-sky-50 p-6 shadow-lg dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60"
              {...fadeIn(0.2)}
            >
              <h3 className="text-xl font-semibold text-black">
                {copy.contentTitle}
              </h3>
              <p className="mt-2 text-sm text-black">{copy.contentSubtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {contentFilters.map((filter, index) => {
                  const Icon = contentFilterIcons[filter.id as ContentFilter];
                  const isActive = activeContentFilter === filter.id;
                  return (
                    <motion.button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveContentFilter(filter.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
                        isActive
                          ? "border-sky-400 bg-sky-500/10 text-sky-700"
                          : "border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700"
                      }`}
                      {...fadeIn(index * 0.1, 15)}
                    >
                      <Icon className="h-4 w-4" /> {filter.label}
                    </motion.button>
                  );
                })}
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {activeScenario.map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex items-start gap-3"
                    {...fadeIn(index * 0.08, 15)}
                  >
                    <ArrowRight className="mt-1 h-3.5 w-3.5 text-sky-500" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.section>
        {/* 5th */}

        {/* 6th */}
        <motion.section
          className="grid w-full gap-4 rounded-3xl border border-white bg-white p-6 shadow-sm dark:border-transparent dark:bg-white sm:grid-cols-2 lg:grid-cols-3"
          {...fadeIn(0.2)}
        >
          {statsTiles.map((tile, index) => (
            <motion.div
              key={tile.label}
              className="flex flex-col gap-1 rounded-2xl border border-sky-100 bg-sky-50 p-6 text-left"
              {...fadeIn(index * 0.15, 20)}
            >
              <p className="text-2xl font-semibold text-sky-600">
                {tile.value}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {tile.label}
              </p>
            </motion.div>
          ))}
        </motion.section>
        {/* 6th */}

        {/* 7th */}
        <ChooseUrPlan />
        <motion.section className="space-y-10" id="pricing" {...fadeIn(0.1)}>
          <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              {copy.pricingTitle}
            </h2>
            <p className="text-base text-slate-600 md:text-lg">
              {copy.pricingSubtitle}
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan, index) => (
              <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
                <Card
                  className={`border bg-white p-6 hadow-lg transition hover:-translate-y-1 dark:border-sky-100 dark:bg-white dark:text-black ${
                    plan.popular
                      ? "border-sky-400 shadow-2xl"
                      : "border-sky-100"
                  }`}
                >
                  <CardHeader className="space-y-3 text-black">
                    <CardTitle className="flex items-center justify-between text-2xl text-black dark:text-black">
                      <span className="flex items-center gap-2">
                        {plan.title}
                        {plan.popular && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-100 px-2 py-0.5 text-[11px] text-sky-600">
                            {language === "ar"
                              ? "الأكثر طلبًا"
                              : "Most popular"}
                          </span>
                        )}
                      </span>
                      <span className="text-lg text-sky-600">
                        ${plan.price}
                      </span>
                    </CardTitle>
                    <p className="text-sm text-black">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-black dark:text-black">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        className="flex items-start gap-2 text-sky-600"
                        {...fadeIn(featureIndex * 0.08, 15)}
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" />{" "}
                        {feature}
                      </motion.div>
                    ))}
                    <Button className="mt-4 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400">
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* 7th */}

        {/* 8th */}
        <motion.div {...fadeIn(0.1)}>
          <Card className="rounded-3xl border border-transparent bg-gradient-to-br from-sky-100 via-white to-sky-50 p-8 text-center text-slate-900 shadow-xl dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60 dark:text-slate-900">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl font-semibold text-black md:text-4xl">
                {copy.enterpriseTitle}
              </CardTitle>
              <p className="text-base text-slate-900 md:text-lg dark:text-slate-900">
                {copy.enterpriseSubtitle}
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4 text-slate-900 dark:text-slate-900">
              <Button
                size="lg"
                className="rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800"
              >
                {copy.enterpriseCta}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        {/* 8th */}

        {/* 9th */}
        <motion.section
          id="contact"
          className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-sky-50 p-8 text-center text-slate-700 shadow-xl dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60"
          {...fadeIn(0.1)}
        >
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            {copy.finalCtaTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            {copy.finalCtaSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-sky-500 px-8 text-white hover:bg-sky-400"
            >
              {copy.finalPrimaryCta}
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-sky-500 px-8 text-white hover:bg-sky-400"
            >
              {copy.finalSecondaryCta}
            </Button>
          </div>
        </motion.section>
        {/* 9th */}

        {/* 10th */}
        <footer className="-mx-6 space-y-10 border-t border-sky-100 bg-white px-6 py-8 text-sm text-slate-600 shadow-inner md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm space-y-3">
              <Link
                href="/"
                className="flex items-center gap-3 text-lg font-semibold text-slate-900"
              >
                <Image
                  src="/logo.svg"
                  alt="Front Cloud logo"
                  width={36}
                  height={28}
                  className="h-9 w-auto"
                />
                Front Cloud Creative
              </Link>
              <p className="text-sm text-slate-500">{copy.footerTagline}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {Object.values(copy.footerLinks).map((group) => (
                <div key={group.heading} className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {group.heading}
                  </p>
                  <ul className="space-y-2 text-xs text-slate-500">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="transition hover:text-sky-600"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-sky-100 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>{copy.footerLegal}</p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="email"
                placeholder={copy.footerInputPlaceholder}
                className="rounded-full border border-sky-100 bg-white px-4 py-2 text-xs text-slate-700 focus:border-sky-400 focus:outline-none"
              />
              <Button className="rounded-full bg-sky-500 px-5 text-white hover:bg-sky-400">
                {copy.footerBottomCta}
              </Button>
            </div>
          </div>
        </footer>
        {/* 10th */}
      </main>
    </div>
  );
};
