"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap } from "lucide-react";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  title: string;
  price: string;
  priceValid?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  tookens?: string;
  month?: string;
  boundary?: string;
  Limitations?: string[];
}

interface PricingSectionProps {
  copy: {
    pricingHead: string;
    pricingTitle: string;
    pricingSubtitle: string;
    pricingPlans: PricingPlan[];
    language: "en" | "ar";
  };
}

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: -offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay },
  viewport: { once: false, amount: 0.3 },
});

export const PricingSection = ({ copy }: PricingSectionProps) => {
  const pricingPlans = copy.pricingPlans.map(plan => ({
    ...plan,
    features: plan.features || [],
    Limitations: plan.Limitations || []
  }));

  return (
    <motion.section id="pricing" className="space-y-10" {...fadeIn(0.1)}>
      <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
        <div className="inline-flex justify-center items-center border py-0.5 px-2 mx-auto rounded-md border-slate-300 gap-1 dark:bg-[#0f1729]">
          <Zap className="w-3 h-auto mr-1 dark:text-[#f2f6fa]" />
          <span className="text-xs font-medium dark:text-[#f2f6fa] dark:border-[#324154]">
            {copy.pricingHead}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 md:text-5xl dark:text-[#f2f6fa]">
          {copy.pricingTitle}
        </h2>
        <p className="text-base text-[#787F8F] md:text-xl dark:text-[#93a2b8]">
          {copy.pricingSubtitle}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan, index) => (
          <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
            <Card
              className={`p-6 bg-white transition hover:-translate-y-1 shadow-lg dark:bg-[#1e293b] 
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
                <CardTitle className="flex flex-col items-center justify-center text-inherit text-xl text-black dark:text-black relative">
                  <span className="my-2 font-normal dark:text-[#f2f6fa]">
                    {plan.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {plan.popular && (
                      <span className="absolute -top-24 left-1/2 -translate-x-1/2 rounded-full border border-sky-300 bg-gradient-to-r from-[#09a0eb] to-[#0773f7] px-2 py-0.5 text-sm text-white">
                        {copy.language === "ar" ? "الأكثر طلبًا" : "Most Popular"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-3xl text-black mr-1 dark:text-[#f2f6fa]">
                      {plan.price}
                    </span>
                    <span className="text-[#65758c] text-base dark:text-[#93a2b8]">
                      {plan.priceValid}
                    </span>
                  </div>
                </CardTitle>
                <p className="text-sm text-[#65758c] text-center dark:text-[#93a2b8]">
                  {plan.description}
                </p>
                {plan.tookens && plan.month && (
                  <div className="items-center mx-auto border border-slate-300 px-3 py-0.5 rounded-lg text-xs font-semibold text-[#0A0A0A] dark:border-[#324154]">
                    <span className="mr-1 dark:text-[#f2f6fa] dark:border-[#324154]">
                      {plan.tookens}
                    </span>
                    <span className="dark:text-[#f2f6fa]">
                      {" "}
                      {plan.month}
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-black dark:text-black">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    className="flex items-start gap-2 text-black dark:text-[#f2f6fa]"
                    {...fadeIn(featureIndex * 0.08, 15)}
                  >
                    <Check className="mt-0.5 h-4 w-4 text-sky-500" />
                    {feature}
                  </motion.div>
                ))}

                {plan.boundary && (
                  <motion.div className="flex flex-col items-start gap-2 mt-3 border-t border-slate-300">
                    <span className="font-semibold text-gray-500 mt-3 text-xs dark:text-[#93a2b8]">
                      {plan.boundary}
                    </span>
                    <div className="flex flex-col gap-1">
                      {plan.Limitations?.map((limit, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-gray-600 text-xs dark:text-[#93a2b8]"
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
                      : "bg-white text-black border border-slate-300 hover:bg-sky-200 hover:text-[#0b60af] dark:bg-[#243142] dark:border-[#324154] dark:text-[#f2f6fa]"
                  }`}
                  style={{ marginTop: "1.5rem" }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};