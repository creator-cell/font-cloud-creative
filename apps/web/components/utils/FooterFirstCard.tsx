"use client";

import { UsersRound, Sparkles, TrendingUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";

const FooterFirstCard = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  const copy = useMemo(() => translations[language], [language]);

  const stats = [
    {
      icon: <UsersRound className="text-sky-500 w-8 h-8" />,
      value: "10,000+",
      label: "Active Users",
    },
    {
      icon: <Sparkles className="text-sky-500 w-8 h-8" />,
      value: "1M+",
      label: "Content Generated",
    },
    {
      icon: <TrendingUp className="text-sky-500 w-8 h-8" />,
      value: "95%",
      label: "User Satisfaction",
    },
  ];

  return (
    <motion.section {...fadeIn(0.1)} className="py-5 ">
      <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="rounded-xl bg-white shadow-md py-5 px-8 hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex flex-col items-center space-y-4 mt-1">
              <div className="bg-sky-100 rounded-full p-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FooterFirstCard;
