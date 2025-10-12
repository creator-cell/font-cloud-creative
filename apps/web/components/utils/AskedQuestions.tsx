"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";

const AskedQuestions = ({ copy }: any) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });
  // const copy = useMemo(() => translations[language], [language]);

  return (
    <motion.div {...fadeIn(0.1)} className=" cursor-default">
      <h2 className="text-center text-2xl font-semibold text-[#0A0A0A]">
        {copy.FAQTitle}
      </h2>

      <div className="mx-auto mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[#0A0A0A]">
            {copy.FAQLeftOneTitle}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {copy.FAQLeftRightDesc}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[#0A0A0A]">
            {copy.FAQLeftTwoTitle}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {copy.FAQLeftRightDesc2}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[#0A0A0A]">
            {copy.FAQLeftThreeTitle}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {copy.FAQLeftRightDesc3}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-[#0A0A0A]">
            {copy.FAQLeftFourTitle}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {copy.FAQLeftRightDesc4}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AskedQuestions;
