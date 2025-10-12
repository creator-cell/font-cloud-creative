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
  MessageSquare,
  Star,
  Users,
  ChevronsLeftRight,
} from "lucide-react";

import { translations } from "../landing/translations";

const contentFilterOrder = ["copy", "product", "social"] as const;
const speedFeatureIcons: LucideIcon[] = [Clock, Sparkles, Wand2];
const orchestrateIcons: LucideIcon[] = [LayoutGrid, Target];
const creationFeatureIcons: LucideIcon[] = [
  Brain,
  MessageSquare,
  Star,
  Users,
  MessageCircle,
  ChevronsLeftRight,
  Server,
];
type ContentFilter = (typeof contentFilterOrder)[number];

const contentFilterIcons: Record<ContentFilter, LucideIcon> = {
  copy: PenLine,
  product: Server,
  social: Share2,
};

const Features = ({ copy }: any) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const creationFeatures = (copy.creationFeatures || []).map(
    (feature: { title: string; description: string }, index: number) => ({
      ...feature,
      Icon: creationFeatureIcons[index] ?? Sparkles,
    })
  );

  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  return (
    <motion.section className="space-y-10" id="resources" {...fadeIn(0.1)}>
      <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
        <span className="inline-flex items-center text-xs font-medium border border-slate-300 p-1 rounded-lg">
          <Sparkles className="w-4 h-4 mr-1" />
          {copy.creationFeature}
        </span>
        <h2 className="text-[28px] md:text-5xl font-bold text-slate-900">
          {copy.creationTitle}
        </h2>
        <p className="text-lg text-slate-600 md:text-lg">
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
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#EAF2FF] text-sky-600">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-normal text-slate-900">{title}</h3>
            <p className="mt-6 text-base leading-6 text-slate-600">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Features;
