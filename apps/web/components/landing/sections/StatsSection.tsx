"use client";

import { motion } from "framer-motion";
import type { StatsTile } from "../types";
import { fadeIn } from "../animations";

type StatsSectionProps = {
  stats: StatsTile[];
};

export const StatsSection = ({ stats }: StatsSectionProps) => (
  <motion.section {...fadeIn(0.1)} className="dark:bg-[#0F1729]">
    <div className="grid gap-6 md:grid-cols-3 text-center">
      {stats.map(({ Icon, description, label }, index) => (
        <motion.div
          key={label}
          className="rounded-xl bg-white border dark:bg-[#1E293B] dark:border dark:border-[#2a364a] shadow-md py-5 px-8 hover:shadow-lg transition-shadow duration-300"
          whileHover={{ scale: 1.03 }}
          {...fadeIn(index * 0.1, 10)}
        >
          <div className="flex flex-col items-center space-y-4 mt-1">
            {Icon ? (
              <div className="bg-sky-100 rounded-full text-sky-500 p-3 dark:bg-[#21384E]">
                <Icon className="w-6 h-6" />
              </div>
            ) : null}
            <div className="text-3xl font-bold text-gray-900 dark:text-[#f2f6fa]">{description}</div>
            <div className="text-gray-600 dark:text-[#72879c]">{label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);
