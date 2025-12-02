"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, LayoutGrid, Target, type LucideIcon } from "lucide-react";
import type { LandingTranslation } from "../types";

type OrchestrateCard = {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
};

type OrchestrateProps = {
  copy: LandingTranslation;
};

const orchestrateIcons: LucideIcon[] = [LayoutGrid, Target];

export const OrchestrateSection = ({ copy }: OrchestrateProps) => {
  const orchestrateCards = (copy.orchestrateCards || []).map((card: { badge: string; title: string; description: string; bullets: string[] }, index: number) => ({
    ...card,
    Icon: orchestrateIcons[index] ?? LayoutGrid
  }));

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {orchestrateCards.map(({ badge, title, description, bullets, Icon }: OrchestrateCard) => (
        <Card
          key={title}
          className="border border-white bg-white p-6 text-slate-900 shadow-lg dark:border-transparent dark:bg-white dark:text-slate-900"
        >
          <CardHeader className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs text-sky-600">
              <Icon className="h-4 w-4" /> {badge}
            </span>
            <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
            <p className="text-sm text-slate-900">{description}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-900">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3 text-sm text-sky-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" />
                <span className="text-sky-600">{bullet}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
