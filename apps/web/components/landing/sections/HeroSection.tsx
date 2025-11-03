"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { type LandingTranslation } from "../translations.js";

type HeroSectionProps = {
  copy: LandingTranslation;
  language: "en" | "ar";
};

export const HeroSection = ({ copy, language }: HeroSectionProps) => {
  return (
    <section id="product" className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
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
          <p className="text-base text-slate-600 md:text-lg">{copy.heroDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="rounded-full bg-sky-500 px-8 text-white transition hover:-translate-y-1 hover:bg-sky-400">
            {copy.heroPrimaryCta}
          </Button>
          <Button
            size="lg"
            className="rounded-full bg-sky-500 px-8 text-white transition hover:-translate-y-1 hover:bg-sky-400"
          >
            <PlayCircle className="mr-2 h-5 w-5" /> {copy.heroSecondaryCta}
          </Button>
          <Link href="#contact" className="flex items-center gap-2 text-sm text-sky-600 transition hover:text-sky-500">
            {copy.heroTertiaryCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {copy.heroStats.map((stat: { value: string; label: string }) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
            >
              <p className="text-2xl font-semibold text-sky-600">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="border border-white bg-white p-6 text-slate-900 shadow-xl dark:border-transparent dark:bg-white dark:text-slate-900">
        <CardHeader className="space-y-3">
          <CardTitle className="text-lg text-slate-900">{copy.providerHeading}</CardTitle>
          <p className="text-sm text-slate-900">{copy.providerDescription}</p>
        </CardHeader>
        <CardContent className="space-y-5 text-slate-900">
          <div className="flex flex-wrap gap-2">
            {copy.providerLabels.map((label: string) => (
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
      </Card>
    </section>
  );
};