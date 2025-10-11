"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";

const AskedQuestions = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });
  const copy = useMemo(() => translations[language], [language]);

  return (
    <motion.div {...fadeIn(0.1)} className="py-10 cursor-default">
      <h2 className="text-center text-2xl font-semibold text-slate-900">
        Frequently Asked Questions
      </h2>

      <div className="mx-auto mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
        {/* Question 1 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-slate-900">
            Can I switch plans anytime?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Yes, you can upgrade or downgrade your plan at any time. Changes take
            effect immediately.
          </p>
        </div>

        {/* Question 2 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-slate-900">
            What happens to unused tokens?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tokens reset monthly and don't roll over. We recommend choosing a
            plan that fits your usage.
          </p>
        </div>

        {/* Question 3 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-slate-900">Do you offer refunds?</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Yes, we offer a 30-day money-back guarantee for all paid plans, no
            questions asked.
          </p>
        </div>

        {/* Question 4 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-slate-900">
            Is there an API available?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            API access is available on Pro and Team plans with full documentation
            and support.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AskedQuestions;
