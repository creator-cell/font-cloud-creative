"use client";

import { Sparkles } from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";

const LimitedTime = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  const copy = useMemo(() => translations[language], [language]);

  return (
    <motion.section
      {...fadeIn(0.1)}
      className="py-6 "
      // bg-gradient-to-r from-sky-200 to-sky-400
    >
      <motion.div className="flex flex-col items-center text-center px-4">
        <div className="flex items-center justify-center gap-2 border bg-[#dcf3fc] rounded-full py-1.5 px-4">
          <Sparkles className="text-[#2ea4e8] w-4 h-4" />
          <h3 className="text-lg md:text-sm font-semibold text-[#2ea4e8]">
            Limited Time: Free tokens doubled for new users
          </h3>
        </div>
        <p className="max-w-2xl text-[#65758c] mt-6">
          Join the AI content revolution today. Start creating professional
          content that converts with the power of multiple AI providers in one
          unified platform.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default LimitedTime;
