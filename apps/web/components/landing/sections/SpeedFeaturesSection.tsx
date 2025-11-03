"use client";

import { motion } from "framer-motion";
import { Brain, CircleCheck, MessageSquare, Sparkles, type LucideIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface SpeedFeature {
  title: string;
  description: string;
  Icon: LucideIcon;
  iconColor?: string;
  style?: React.CSSProperties;
}

interface SpeedFeaturesSectionProps {
  copy: {
    speedDemo: string;
    speedTitle: string;
    speedTitleSecond: string;
    speedSubtitle: string;
    speedContent: string;
    speedReady: string;
    speedFeatures: SpeedFeature[];
  };
}

const speedFeatureIcons: LucideIcon[] = [MessageSquare, Brain, Sparkles];

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: -offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay },
  viewport: { once: false, amount: 0.3 },
});

export const SpeedFeaturesSection = ({ copy }: SpeedFeaturesSectionProps) => {
  const speedFeatures = copy.speedFeatures.map(
    (feature, index) => ({
      ...feature,
      Icon: speedFeatureIcons[index] ?? Sparkles,
    })
  );

  return (
    <motion.section
      className="space-y-6 pb-8 bg-white dark:bg-[#0F1729]"
      id="solutions"
      {...fadeIn(0.1)}
    >
      <motion.div
        className="text-center"
        {...fadeIn(0.05, 10)}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] px-1 rounded-md py-0.5 dark:bg-[#0f1a2b] dark:text-[#f2f6fa] dark:border-[#324154]">
          <Sparkles className="w-3 h-3 mr-1" />
          {copy.speedDemo}
        </span>
      </motion.div>

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
          ({ title, description, Icon, iconColor, style }, index) => (
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
  );
};