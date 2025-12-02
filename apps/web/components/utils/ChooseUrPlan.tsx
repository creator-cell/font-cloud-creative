import {
  Check,
  CheckCircle2,
  Crown,
  Rocket,
  UsersRound,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { CardTitle } from "../ui/card";
import { CardHeader } from "../ui/card";
import { Card } from "../ui/card";
import type { LandingTranslation } from "../landing/types";
import type { PricingPlan } from "../landing/types";

const ChooseUrPlan = ({ copy }: { copy?: LandingTranslation }) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });
  const localCopy = copy ?? translations[language];
  const pricingPlans = (localCopy.pricingPlans || []) as PricingPlan[];
  return (
    <motion.section id="pricing" className="space-y-10" {...fadeIn(0.1)}>
      <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
        <div
          className="inline-flex justify-center items-center border py-0.5
         px-2 mx-auto rounded-md border-slate-300 gap-1"
        >
          <Zap className="w-3 h-auto mr-1" />
          <span className="text-xs font-medium">{localCopy.pricingHead}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">
          {localCopy.pricingTitle}
        </h2>
        <p className="text-base text-[#787F8F] md:text-xl">
          {localCopy.pricingSubtitle}
        </p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan, index) => {
          console.log("plan");
          return (
            <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
              <Card
                className={`p-6 bg-white transition hover:-translate-y-1 shadow-lg dark:bg-white dark:text-black 
                                ${
                                  plan.popular
                                    ? "shadow-2xl hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                                    : "border border-gray-300 hover:shadow-xl"
                                }`}
                style={
                  plan.popular
                    ? { borderWidth: "2px", borderColor: "#38bdf8" }
                    : { borderColor: "#EEEEEE" }
                }
              >
                <CardHeader className="space-y-1 text-black">
                  <span>
                    {plan.logo && <plan.logo {...(plan.logoProps || {})} />}
                  </span>
                  <CardTitle className="flex flex-col items-center justify-center text-inherit text-xl text-black dark:text-black relative">
                    <span className="my-2 font-normal">{plan.title}</span>
                    <div className="flex items-center gap-2">
                      {plan.popular && (
                        <span className="absolute -top-24 left-1/2 -translate-x-1/2 rounded-full border border-sky-300 bg-gradient-to-r from-[#09a0eb] to-[#0773f7] px-2 py-0.5 text-sm text-white">
                          {language === "ar" ? "الأكثر طلبًا" : "Most Popular"}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-3xl text-black mr-1">
                        {plan.price}
                      </span>
                      <span className="text-[#65758c] text-base">
                        {plan.priceValid}
                      </span>
                    </div>
                  </CardTitle>
                  <p className="text-sm text-[#65758c] text-center">
                    {plan.description}
                  </p>
                  <div className="items-center mx-auto border border-slate-300 px-3 py-0.5 rounded-lg text-xs font-semibold text-[#0A0A0A]">
                    <span className="mr-1">{plan.tookens}</span>
                    <span> {plan.month}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm text-black dark:text-black">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-2 text-black"
                      {...fadeIn(featureIndex * 0.08, 15)}
                    >
                      <Check className="mt-0.5 h-4 w-4 text-sky-500" />
                      {feature}
                    </motion.div>
                  ))}

                  {plan.boundary && (
                    <motion.div className="flex flex-col items-start gap-2 mt-3 border-t border-slate-300">
                      <span className="font-semibold text-gray-500 mt-3 text-xs">
                        {plan.boundary}
                      </span>
                      <div className="flex flex-col gap-1 ">
                        {(plan.Limitations ?? []).map((limit, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2  text-gray-600 text-xs"
                          >
                            <span>•</span>
                            {limit}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Button
                    className={`w-full rounded-full border mt-4 ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#09a0eb] to-[#0773f7] border-none text-white hover:from-[#0773f7] hover:to-[#09a0eb] !mb-14"
                        : "bg-white text-black border border-slate-300 hover:bg-sky-200 hover:text-[#0b60af] "
                    }`}
                    style={{ marginTop: "1.5rem" }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default ChooseUrPlan;
