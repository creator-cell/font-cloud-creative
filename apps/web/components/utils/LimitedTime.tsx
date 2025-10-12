"use client";

import { Sparkles } from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";

const LimitedTime = ({ copy }: any) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  // const copy = useMemo(() => translations[language], [language]);

  return (
    <motion.section {...fadeIn(0.1)}>
      <motion.div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2 bg-[#dcf3fc] rounded-full py-1.5 px-3">
          <Sparkles className="text-[#2ea4e8] w-4 h-4" />
          <h3 className="text-sm font-semibold text-[#2ea4e8]">
            {copy.LimitedTime}
          </h3>
        </div>
        <p className="text-[#65758c] mt-6">{copy.LimitedDes}</p>
      </motion.div>
    </motion.section>
  );
};

export default LimitedTime;
