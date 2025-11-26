"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Crown, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FaqItem {
  title: string;
  description: string;
}

interface FAQ {
  FAQTitle: string;
  FAQLeftOneTitle: string;
  FAQLeftTwoTitle: string;
  FAQLeftThreeTitle: string;
  FAQLeftFourTitle: string;
  FAQLeftRightDesc: string;
  FAQLeftRightDesc2: string;
  FAQLeftRightDesc3: string;
  FAQLeftRightDesc4: string;
}

interface FinalCTA {
  finalCtaTitle: string;
  finalCtaTitle2: string;
  finalCtaSubtitle: string;
  finalData: string[];
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  finalSecondaryCtaPercentage: string;
  finalSecondaryCtaSatisfaction: string;
  finalMil: string;
  finalGen: string;
}

interface EnterpriseCTA {
  enterpriseTitle: string;
  enterpriseSubtitle: string;
  enterpriseCta: string;
  enterpriseCta2: string;
}

interface FAQAndCTASectionProps {
  copy: FAQ & FinalCTA & EnterpriseCTA;
}

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: -offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay },
  viewport: { once: false, amount: 0.3 },
});

export const FAQAndCTASection = ({ copy }: FAQAndCTASectionProps) => {
  return (
    <>
      <motion.div {...fadeIn(0.1)} className="cursor-default">
        <h2 className="text-center text-2xl font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
          {copy.FAQTitle}
        </h2>

        <div className="mx-auto mt-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-5">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
              {copy.FAQLeftOneTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
              {copy.FAQLeftRightDesc}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
              {copy.FAQLeftTwoTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
              {copy.FAQLeftRightDesc2}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
              {copy.FAQLeftThreeTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
              {copy.FAQLeftRightDesc3}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#0A0A0A] dark:text-[#f2f6fa]">
              {copy.FAQLeftFourTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-[#93a2b8]">
              {copy.FAQLeftRightDesc4}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeIn(0.1)}>
        <Card className="rounded-3xl border border-sky-300 bg-[#fafbfa] p-8 text-center text-slate-900 shadow-xl dark:border-transparent dark:bg-[#111a2e] dark:border-[#193a59]">
          <CardHeader>
            <div className="flex bg-[#dcf0fa] justify-center items-center mx-auto w-16 h-16 rounded-full mt-2">
              <span className="text-[#0ea3e8] items-center">
                <Crown size={35} />
              </span>
            </div>
            <CardTitle className="text-2xl text-black font-bold mt-3 dark:text-[#f2f6fa]">
              {copy.enterpriseTitle}
            </CardTitle>
            <p className="text-base text-[slate-900] dark:text-[#93a2b8] max-w-[42rem] mx-auto">
              {copy.enterpriseSubtitle}
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4 text-slate-900 dark:text-slate-900 mt-6">
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-sky-200 border border-slate-300 w-full sm:w-fit dark:text-[#93a2b8] dark:bg-[#1c283d] dark:border-[#324154]"
            >
              {copy.enterpriseCta}
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-[#09a0eb] to-[#0773f7] text-white hover:bg-slate-800 w-full sm:w-fit"
            >
              {copy.enterpriseCta2}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.section
        {...fadeIn()}
        className="relative bg-gradient-to-r from-[#0072ff] via-[#0099ff] to-[#00c6ff] text-[#FFFFFF] rounded-2xl py-10 px-6 md:px-8 my-10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-3">
              {copy.finalCtaTitle} <br className="hidden md:block" />{" "}
              {copy.finalCtaTitle2}
            </h2>
            <p className="text-[#E6F1FC] mb-4 text-lg">
              {copy.finalCtaSubtitle}
            </p>

            <div className="grid sm:grid-cols-2 gap-2 mb-6 text-[#E6F1FC]">
              {copy.finalData.map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-[#E6F1FC] w-4 h-4" />
                  {text}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row">
              <Link
                href="/signin?register=1"
                className="flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-sky-400 transition hover:bg-white/90 sm:w-fit"
              >
                <Zap className="mr-2 h-auto w-4" />
                {copy.finalPrimaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit dark:bg-[#1c67d8] dark:text-[#f2f6fa] dark:border-[#324154]" asChild>
                <Link href="https://wa.me/966504576354" target="_blank" className="flex items-center">
                  <Zap className="w-4 h-auto mr-2" />
                  {copy.finalSecondaryCta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative rounded-2xl bg-[#1e6ce3] p-5 shadow-lg">
              <img
                src="/imgt.jpg"
                alt="content creation"
                className="rounded-xl w-[28rem] h-[16rem] object-cover"
              />

              <div className="absolute -top-4 -right-4 bg-white rounded-lg px-3 py-4 flex items-center gap-2 shadow">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                <div className="flex flex-col">
                  <span className="text-sky-400 font-bold">
                    {copy.finalSecondaryCtaPercentage}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {copy.finalSecondaryCtaSatisfaction}
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 bg-white rounded-lg px-4 py-5 flex items-center gap-2 shadow">
                <Sparkles className="w-6 h-6 text-[#00bd7e]" />
                <div className="flex flex-col">
                  <span className="text-[#00bd7e] font-extrabold">
                    {copy.finalMil}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {copy.finalGen}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};
