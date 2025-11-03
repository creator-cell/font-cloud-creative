"use client";

import { motion } from "framer-motion";
import { 
  Brain,
  MessageSquare,
  Sparkles,
  UsersRound,
  BarChart,
  Code,
  type LucideIcon 
} from "lucide-react";

interface CreationFeature {
  title: string;
  description: string;
  Icon: LucideIcon;
}

interface CreationFeaturesSectionProps {
  copy: {
    creationFeature: string;
    creationTitle: string;
    creationSubtitle: string;
    creationFeatures: Omit<CreationFeature, "Icon">[];
  };
}

const creationFeatureIcons: LucideIcon[] = [
  Brain,
  MessageSquare,
  Sparkles,
  UsersRound,
  BarChart,
  Code,
];

const creationFeatureColors = [
  "bg-[#ebf3ff] text-[#2b80ff] dark:bg-[#1F324F] dark:text-[#5c9dff]",
  "bg-[#f7edff] text-[#ab45ff] dark:bg-[#2C2C4F] dark:text-[#d38cff]",
  "bg-[#e6faf3] text-[#00bc7d] dark:bg-[#1B3842] dark:text-[#38e1a4]",
  "bg-[#fff0e6] text-[#ff6a00] dark:bg-[#352F35] dark:text-[#ffa057]",
  "bg-[#ffebf5] text-[#f5339b] dark:bg-[#342A45] dark:text-[#ff70c0]",
  "bg-[#e6f8fc] text-[#00b7db] dark:bg-[#1B374B] dark:text-[#3fd4ef]",
];

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: -offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay },
  viewport: { once: false, amount: 0.3 },
});

export const CreationFeaturesSection = ({ copy }: CreationFeaturesSectionProps) => {
  const creationFeatures = copy.creationFeatures.map(
    (feature, index) => ({
      ...feature,
      Icon: creationFeatureIcons[index] ?? Sparkles,
    })
  );

  return (
    <motion.section
      className="space-y-10 bg-[#fafdff] dark:bg-[#0f1729]"
      id="resources"
      {...fadeIn(0.1)}
    >
      <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
        <span className="inline-flex items-center text-xs font-medium border border-[#e1e8f0] py-1 px-3 rounded-lg dark:text-[#f2f6fa] dark:border-[#324154]">
          <Sparkles className="w-3 h-3 mr-1" />
          {copy.creationFeature}
        </span>
        <h2 className="text-[28px] sm:text-4xl lg:text-5xl font-bold dark:text-[#f2f6fa]">
          {copy.creationTitle}
        </h2>
        <p className="text-xl text-muted-foreground md:text-lg max-w-3xl mx-auto dark:text-[#93a2b8]">
          {copy.creationSubtitle}
        </p>
      </motion.div>
      
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {creationFeatures.map(({ title, description, Icon }, index) => (
          <motion.div
            key={title}
            className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:bg-[#1e293b] dark:border-[#324154]"
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

            <h3 className="mt-4 text-xl font-normal text-slate-900 dark:text-[#f2f6fa]">
              {title}
            </h3>
            <p className="mt-6 text-base leading-6 text-slate-600 dark:text-[#93a2b8]">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};