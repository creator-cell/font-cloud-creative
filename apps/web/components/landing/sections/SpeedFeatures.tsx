"use client";

import { Clock, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import type { LandingTranslation } from "../translations.js";

type SpeedFeature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

type SpeedFeaturesProps = {
  copy: LandingTranslation;
};

const speedFeatureIcons: LucideIcon[] = [Clock, Sparkles, Wand2];

export const SpeedFeatures = ({ copy }: SpeedFeaturesProps) => {
  const speedFeatures = (copy.speedFeatures || []).map((feature: { title: string; description: string }, index: number) => ({
    ...feature,
    Icon: speedFeatureIcons[index] ?? Sparkles
  }));

  return (
    <section className="space-y-10" id="solutions">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">{copy.speedTitle}</h2>
        <p className="text-base text-slate-600 md:text-lg">{copy.speedSubtitle}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {speedFeatures.map(({ title, description, Icon }: SpeedFeature) => (
          <div key={title} className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};