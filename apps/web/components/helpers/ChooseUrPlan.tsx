import { CheckCircle2, Crown, Rocket, UsersRound, Zap } from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { CardTitle } from "../ui/card";
import { CardHeader } from "../ui/card";
import { Card } from "../ui/card";

const ChooseUrPlan = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });
  const copy = useMemo(() => translations[language], [language]);
  const pricingPlans = (copy.pricingPlans || []) as Array<
    {
      id: string;
      title: string;
      price: string;
      description: string;
      features: string[];
      cta: string;
      popular: boolean;
      logo?: React.ComponentType<any>;
      logoProps?: Record<string, any>;
    }
  >;
  return (
    <motion.section className="space-y-10" {...fadeIn(0.1)}>
      {/* id="pricing"  */}
      <motion.div className="space-y-3 text-center" {...fadeIn(0.1, 20)}>
        <div className="flex justify-center items-center border w-20 h-auto py-0.5 px-2 mx-auto rounded-xl">
          <Zap className="w-3 h-auto mr-1" />
          <span className="text-sm font-medium">Pricing</span>
        </div>
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          {copy.pricingTitle}
        </h2>
        <p className="text-base text-slate-600 md:text-lg">
          {copy.pricingSubtitle}
        </p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan, index) => {
          console.log("Plan Data:", plan);
          console.log("Is Popular:", plan.popular);

          return (
            <motion.div key={plan.id} {...fadeIn(index * 0.2)}>
              <Card
                className={`p-6 bg-white transition hover:-translate-y-1 shadow-lg dark:bg-white dark:text-black 
            ${
              plan.popular
                ? "border-2 border-sky-400 shadow-2xl"
                : "border border-gray-300"
            }`}
              >
                <CardHeader className="space-y-3 text-black">
                  <span>
                    {plan.logo && <plan.logo {...(plan.logoProps || {})} />}
                  </span>
                  <CardTitle className="flex flex-col items-center justify-center text-2xl text-black dark:text-black">
                     {plan.title}
                    <span className="flex items-center gap-2">
                      <span className="text-4xl">{plan.title}</span>
                      {/* {plan.popular && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-100 px-2 py-0.5 text-[11px] text-sky-600">
                          {language === "ar" ? "الأكثر طلبًا" : "Most popular"}
                        </span>
                      )} */}
                    </span>
                    <span className="text-lg text-sky-600">{plan.price}</span>
                  </CardTitle>
                  <p className="text-sm text-black">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-3 text-sm text-black dark:text-black">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-2 text-sky-600"
                      {...fadeIn(featureIndex * 0.08, 15)}
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-500" />
                      {feature}
                    </motion.div>
                  ))}
                  <Button className="mt-4 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400">
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
