"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, PenLine, Server, Share2, type LucideIcon } from "lucide-react";
import type { ContentFilter, ContentFilterItem, LandingTranslation, NewsroomAction, StatsTile } from "../types.js";

const contentFilterIcons: Record<ContentFilter, LucideIcon> = {
  copy: PenLine,
  product: Server,
  social: Share2
};

type NewsroomSectionProps = {
  copy: LandingTranslation;
  activeContentFilter: ContentFilter;
  setActiveContentFilter: (filter: ContentFilter) => void;
};

export const NewsroomSection = ({
  copy,
  activeContentFilter,
  setActiveContentFilter
}: NewsroomSectionProps) => {
  const contentFilters = (copy.contentFilters || []) as ContentFilterItem[];
  const activeScenario = (copy.contentScenarios?.[activeContentFilter] || []) as string[];

  return (
    <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="rounded-3xl border border-white bg-gradient-to-br p-6 dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-black">{copy.newsroomTitle}</CardTitle>
          <p className="mt-3 text-sm text-black">{copy.newsroomSubtitle}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-900">
          <div className="flex flex-wrap gap-3">
            {copy.newsroomActions.map((action: NewsroomAction | string) => {
              const label = typeof action === "string" ? action : action.label;
              const ActionIcon = typeof action === "string" ? null : action.Icon;
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-4 py-1 text-xs text-sky-600"
                >
                  {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
                  {label}
                </span>
              );
            })}
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <p className="text-sm text-slate-700">{copy.newsroomHighlightTitle}</p>
            <p className="mt-2 text-xs text-slate-500">{copy.newsroomHighlightBody}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col justify-between gap-6 text-slate-900">
        <div className="rounded-3xl border border-white bg-gradient-to-br from-sky-100 via-white to-sky-50 p-6 shadow-lg dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60">
          <h3 className="text-xl font-semibold text-black">{copy.contentTitle}</h3>
          <p className="mt-2 text-sm text-black">{copy.contentSubtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {contentFilters.map((filter: ContentFilterItem) => {
              const Icon = contentFilterIcons[filter.id as ContentFilter];
              const isActive = activeContentFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveContentFilter(filter.id as ContentFilter)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
                    isActive
                      ? "border-sky-400 bg-sky-500/10 text-sky-700"
                      : "border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {filter.label}
                </button>
              );
            })}
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            {activeScenario.map((item: string) => (
              <li key={item} className="flex items-start gap-3">
                <ArrowRight className="mt-1 h-3.5 w-3.5 text-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 rounded-3xl border border-white bg-white p-6 shadow-sm dark:border-transparent dark:bg-white sm:grid-cols-3">
          {copy.statsTiles.map((tile: StatsTile) => (
            <div key={tile.label} className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-center">
              <p className="text-xl font-semibold text-sky-600">{tile.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{tile.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
