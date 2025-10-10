"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Globe2,
  Zap, // Using Zap for Fast Generation
  Target, // Using Target for Conversion Optimized
  RefreshCw, // Using RefreshCw for Automated Workflows
  Clock, // Using Clock for Real-time Processing
} from "lucide-react";

// Dummy translations object to make the component runnable
const translations = {
  en: {
    platformTag: "Platform Overview",
    platformTitle: "Everything you need in one platform",
    platformSubtitle:
      "From content creation to team collaboration, our platform provides all the tools you need to scale your content marketing efforts with AI.",
    platformFeatures: [
      { label: "Enterprise Security", Icon: ShieldCheck },
      { label: "Multi-language Support", Icon: Globe2 },
      { label: "Fast Generation", Icon: Zap },
      { label: "Conversion Optimized", Icon: Target },
      { label: "Automated Workflows", Icon: RefreshCw },
      { label: "Real-time Processing", Icon: Clock },
    ],
  },
  ar: {
    platformTag: "نظرة عامة على المنصة",
    platformTitle: "كل ما تحتاجه في منصة واحدة",
    platformSubtitle:
      "من إنشاء المحتوى إلى تعاون الفريق، توفر منصتنا جميع الأدوات التي تحتاجها لتوسيع نطاق جهود التسويق بالمحتوى باستخدام الذكاء الاصطناعي.",
    platformFeatures: [
      { label: "أمان المؤسسة", Icon: ShieldCheck },
      { label: "دعم متعدد اللغات", Icon: Globe2 },
      { label: "توليد سريع", Icon: Zap },
      { label: "محسّن للتحويل", Icon: Target },
      { label: "سير عمل مؤتمت", Icon: RefreshCw },
      { label: "معالجة في الوقت الفعلي", Icon: Clock },
    ],
  },
};

const PlatformOverview = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const copy = useMemo(() => translations[language], [language]);

  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: true, amount: 0.3 },
  });

  return (
    <motion.section
      className="py-16 md:py-24 max-w-7xl mx-auto px-4"
      {...fadeIn(0.1)}
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <motion.div {...fadeIn(0.1, 20)}>
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-[#F0F9FF] rounded-full">
              {copy.platformTag}
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              {copy.platformTitle}
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              {copy.platformSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {copy.platformFeatures.map((feature, index) => {
              const FeatureIcon = feature.Icon as LucideIcon;
              return (
                <motion.div
                  key={feature.label}
                  className="p-4 flex items-center space-x-3 border border-slate-100 rounded-xl bg-white shadow-sm"
                  {...fadeIn(0.1 + index * 0.1, 15)}
                >
                  <FeatureIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800">
                    {feature.label}
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
              src="#"
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
  );
};

export default PlatformOverview;
