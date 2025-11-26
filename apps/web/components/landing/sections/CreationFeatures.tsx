"use client";

import {
  Bot,
  LayoutGrid,
  ShieldCheck,
  LineChart,
  MessageCircle,
  Server,
  type LucideIcon
} from "lucide-react";
import type { LandingTranslation } from "../types";

type CreationFeature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

type CreationFeaturesProps = {
  copy: LandingTranslation;
};

const creationFeatureIcons: LucideIcon[] = [Bot, LayoutGrid, ShieldCheck, LineChart, MessageCircle, Server];

export const CreationFeatures = ({ copy }: CreationFeaturesProps) => {
  const creationFeatures = (copy.creationFeatures || []).map((feature: { title: string; description: string }, index: number) => ({
    ...feature,
    Icon: creationFeatureIcons[index] ?? Bot
  }));

  return (
    <section className="space-y-10" id="resources">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">{copy.creationTitle}</h2>
        <p className="text-base text-slate-600 md:text-lg">{copy.creationSubtitle}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {creationFeatures.map(({ title, description, Icon }: CreationFeature) => (
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
