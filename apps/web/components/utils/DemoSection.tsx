"use client";

import {
  ArrowRight,
  TrendingUp,
  Zap,
  CheckCircle,
  Sparkles,
  Dot,
  Bot,
  Globe2,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
const DemoSection = () => {
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
    <div>
      <motion.section {...fadeIn()}>
        <div className="w-full max-w-7xl bg-white rounded-xl border border-gray-200 shadow-2xl w-hidden p-8">
          {/* header */}
          <div className="flex justify-between items-center mb-6">
            {/* righthead */}
            <div className="flex gap-2 items-center">
              <div className="flex items-center justify-center rounded-lg bg-sky-500 p-1.5">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[#0A0A0A] text-xs font-bold">
                  Front Cloud Creative
                </span>
                <span className="text-[.60rem] text-[#64748B] ">
                  AI Content Generation Platform
                </span>
              </div>
            </div>
            {/* lefthead */}
            <div className="flex items-center ">
              <div className="flex  ">
                <span className="bg-[#f0f9ff] px-2 py-0.5 rounded-full text-[.70rem] text-[#0c4a6e] font-medium">
                  Live Demo
                </span>
              </div>
              <div className="flex items-center">
                <span>
                  <Dot className="w-8 h-auto text-green-500" />
                </span>
                <span className=" -ml-1 text-[.70rem] text-[#0c4a6e] font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className="flex border-t border-[#e1e8f0]">
            {/* LEFT PANEL */}
            <div className="w-full md:w-[38%] border-b md:border-b-0  border-gray-200 pr-6 py-6 space-y-5 bg-white">
              {/* ho */}
              <div className=" relative">
                <h3 className="text-xs font-semibold text-black mb-3">
                  Content Brief
                </h3>
                <div
                  className="border border-gray-200 rounded-lg bg-[#fafbfc] p-3 text-xs text-gray-800 
                leading-relaxed pb-14"
                >
                  “Create an Instagram ad for a new fitness app targeting
                  millennials. Focus on convenience and quick workouts. Include
                  a strong CTA.”
                </div>

                {/* add */}
                <div className="absolute -bottom-6 -left-12 bg-[#f0f6ff] rounded-lg px-2 py-3 flex items-center gap-2 shadow-lg border border-[#bfdcff]">
                  <TrendingUp className="w-4 h-4 text-[#1c5ffc]" />
                  <div className="flex flex-col">
                    <span className="text-[#1c5ffc] font-medium text-xs">
                      94% Conversion
                    </span>
                    <span className="text-[#1c5ffc] text-xs">
                      vs industry avg
                    </span>
                  </div>
                </div>
                {/* add */}
              </div>
              {/* ho */}

              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2">
                  AI Provider
                </h3>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-[#f9fafb] text-[13px]">
                  <div className="bg-[#00bd7e] p-1.5 rounded-sm">
                    <Bot className="text-black" size={16} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">GPT-4 Turbo</p>
                    <p className="text-gray-500 text-[0.60rem] mt-0.5">
                      OpenAI
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <h3 className="text-xs font-semibold text-black mb-2 ">
                  Content Type
                </h3>
                <div className="border border-gray-200 rounded-lg bg-[#f9fafb] px-2 py-2.5 text-xs text-black">
                  Social Media Ad
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-black mb-2">
                  Tone & Style
                </h3>
                <div className="flex gap-2 text-[.65rem]">
                  <span className="border items-center border-gray-200 rounded-full bg-[#f0f9ff] font-medium px-1.5 text-[#0c4a6e]">
                    Energetic
                  </span>
                  <span className="border border-gray-200 rounded-full bg-[#f0f9ff] font-medium text-[#0c4a6e] px-1.5">
                    Professional
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-[62%]  py-6">
              <div className="flex items-center mb-3 justify-between">
                <div className="text-[13px] font-semibold text-gray-700 ">
                  Generated Content
                </div>
                <div className="flex items-center">
                  <div>
                    <Dot className="w-8 h-auto text-green-500" />
                  </div>
                  <div className="-ml-1 text-[.70rem] text-green-500 font-medium">
                    Generating..
                  </div>
                </div>
              </div>
              <div className="bg-[#edf7fc] border border-[#c3e7fa] rounded-lg p-5 items-center">
                <div className="flex items-center gap-1">
                  <div className="text-[9px] text-[#0a0a0a]  font-medium  border border-[#e1e8f0]  text-center rounded-md px-1 items-center">
                    Headline
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Transform Your Body in Just 15 Minutes!
                </h2>

                <div className="flex items-center gap-1">
                  <div className="text-[9px] text-[#0a0a0a]  font-medium  border border-[#e1e8f0]  text-center rounded-md px-1 items-center">
                    Body Copy
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <p className="text-xs text-[#65758c] mb-4 leading-relaxed">
                  No time for the gym? No problem! FitQuick delivers
                  personalized 15-minute workouts that fit your busy lifestyle.
                  Perfect for busy millennials who want results without the time
                  commitment. Join 50,000+ users getting stronger every day.
                </p>

                <div className="flex items-center gap-1">
                  <div className="text-[9px] text-[#0a0a0a]  font-medium  border border-[#e1e8f0]  text-center rounded-md px-1 items-center">
                    Call to Action
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <Button className="w-full bg-[#007bff] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2">
                  Start Your Free Trial – No Credit Card Required
                  <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
                </Button>
                <div className="border-t mt-5 border-[#dae0e7]"></div>

                <div className="flex items-center mt-3 justify-between">
                  <p className="text-[9px] text-gray-500 ">
                    Tokens used:{" "}
                    <span className="font-semibold">124 / 15,000</span> 
                  </p>
                  <p className="text-[11px] text-gray-500 "> Generated in 12.4s</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-5">
                <Button
                  variant="outline"
                  className="border border-gray-300 bg-[#007bff] hover:bg-[#007bff] text-white text-xs
                   w-full md:w-1/1 py-2 rounded-md"
                >
                  ▶ Try It Yourself
                </Button>
                <Button className="bg-transparent border hover:bg-[#edf5ff] text-black text-xs w-full md:w-1/4 
                py-2 rounded-md">
                    <Globe2 className="w-3 h-3 mr-2"/>
                  Watch Full Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DemoSection;
