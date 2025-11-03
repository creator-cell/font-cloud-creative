"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn } from "../animations";

type FinalCTASectionProps = {
  copy: any; // Replace with proper type from your translations
};

export const FinalCTASection = ({ copy }: FinalCTASectionProps) => {
  return (
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
            {copy.finalData.map((text: string, i: number) => (
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
            <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit dark:bg-[#1c67d8] dark:text-[#f2f6fa] dark:border-[#324154]">
              <Zap className="w-4 h-auto mr-2" />
              {copy.finalSecondaryCta}
              <ArrowRight className="ml-2 w-4 h-4" />
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
  );
};