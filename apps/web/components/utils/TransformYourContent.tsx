"use client";

import {
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const TransformYourContent = () => {
  const fadeIn = (delay = 0.1, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });

  const features = [
    "Start with 15,000 free tokens",
    "No credit card required",
    "Access to all AI providers",
    "Cancel anytime",
  ];

  return (
    <motion.section
      {...fadeIn()}
      className="relative bg-gradient-to-r from-[#0072ff] via-[#0099ff] to-[#00c6ff] text-[#FFFFFF] rounded-2xl py-10 px-6 md:px-8 my-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div>
          <h2 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-3">
            Ready to Transform Your <br className="hidden md:block" /> Content
            Creation?
          </h2>
          <p className="text-[#E6F1FC] mb-4 text-lg">
            Join thousands of creators who have already revolutionized their
            workflow with Front Cloud Creative.
          </p>

          <div className="grid sm:grid-cols-2 gap-2 mb-6 text-[#E6F1FC]">
            {features.map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="text-[#E6F1FC] w-4 h-4" />
                {text}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row">
            <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit">
              <Zap className="w-4 h-auto mr-2" />
              Start Creating Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button className="bg-white text-sky-400 font-semibold hover:bg-white/90 transition rounded-lg px-5 py-3 w-full sm:w-fit">
              <Zap className="w-4 h-auto mr-2" />
              Shedule Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex justify-center">
          <div className="relative rounded-2xl bg-[#1e6ce3] p-5 shadow-lg">
            <img
              src="/imgt.jpg"
              alt="content creation"
              className="rounded-xl w-[28rem] h-[16rem] object-cover"
            />

            <div className="absolute -top-4 -right-4 bg-white rounded-lg px-3 py-4   flex items-center gap-2 shadow">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <div className="flex flex-col">
                <span className="text-sky-400 font-bold">95%</span>
                <span className="text-gray-500 text-xs">Satisfaction</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 bg-white rounded-lg px-4 py-5 flex items-center gap-2 shadow">
              <Sparkles className="w-6 h-6 text-[#00bd7e]" />
              <div className="flex flex-col">
                <span className="text-[#00bd7e] font-extrabold">1M+</span>
                <span className="text-gray-500 text-xs">Generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TransformYourContent;
