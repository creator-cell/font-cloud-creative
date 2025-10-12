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
const DemoSection = ({ copy }: any) => {
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
      <motion.section>
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <div className="flex items-center justify-center rounded-lg bg-sky-500 p-1.5">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[#0A0A0A] text-sm font-semibold">
                  {copy.data.header.platformName}
                </span>
                <span className="text-xs text-[#64748B] ">
                  {copy.data.header.platformDescription}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-50 text-sky-900 px-3 py-1 rounded-full text-xs font-medium">
                {copy.data.header.demoLabel}
              </span>
              <div className="flex items-center">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1"></span>
                <span className="text-sky-900 text-sm font-medium">
                  {copy.data.header.status}
                </span>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div className="flex flex-col sm:flex-row border-t border-[#e1e8f0]">
            {/* Left Panel */}
            <div className="w-full md:w-[38%] border-b md:border-b-0 border-gray-200 pr-6 py-6 space-y-5 bg-white">
              <div className="relative">
                <h3 className="text-sm font-semibold text-black mb-3">
                  {copy.data.leftPanel.contentBrief.title}
                </h3>
                <div className="border border-gray-200 rounded-lg bg-[#fafbfc] p-3 text-sm text-gray-800 leading-relaxed pb-14">
                  {copy.data.leftPanel.contentBrief.example}
                </div>
                <div className="absolute -bottom-6 -left-12 bg-[#f0f6ff] rounded-lg px-2 py-3 md:flex items-center gap-2 shadow-lg border border-[#bfdcff] hidden">
                  <TrendingUp className="w-4 h-4 text-[#1c5ffc]" />
                  <div className="flex flex-col">
                    <span className="text-[#1c5ffc] font-medium text-xs">
                      {copy.data.leftPanel.conversionBadge.percentage}
                    </span>
                    <span className="text-[#1c5ffc] text-xs">
                      {copy.data.leftPanel.conversionBadge.note}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  {copy.data.leftPanel.aiProvider.title}
                </h3>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-[#f9fafb] text-[13px]">
                  <div className="bg-[#00bd7e] p-1.5 rounded-sm">
                    <Bot className="text-black" size={16} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      {copy.data.leftPanel.aiProvider.name}
                    </p>
                    <p className="text-gray-500 text-[0.60rem] mt-0.5">
                      {copy.data.leftPanel.aiProvider.provider}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <h3 className="text-sm font-semibold text-black mb-2">
                  {copy.data.leftPanel.contentType.title}
                </h3>
                <div className="border border-gray-200 rounded-lg bg-[#f9fafb] px-2 py-2.5 text-xs text-black">
                  {copy.data.leftPanel.contentType.type}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-black mb-2">
                  {copy.data.leftPanel.toneStyle.title}
                </h3>
                <div className="flex gap-2 text-[.65rem]">
                  {copy.data.leftPanel.toneStyle.styles.map((style) => (
                    <span
                      key={style}
                      className="border items-center border-gray-200 rounded-full bg-[#f0f9ff] font-medium px-1.5 text-[#0c4a6e] text-xs"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[62%] py-6">
              <div className="flex items-center mb-3 justify-between">
                <div className="text-sm font-bold text-gray-700">
                  {copy.data.rightPanel.generatedContent.title}
                </div>
                <div className="flex items-center">
                  <Dot className="w-8 h-auto text-green-500" />
                  <div className="-ml-1 text-[.70rem] text-green-500 font-medium">
                    {copy.data.rightPanel.generatedContent.generating}
                  </div>
                </div>
              </div>
              <div className="bg-[#edf7fc] border border-[#c3e7fa] rounded-lg p-5 items-center">
                <div className="flex items-center gap-1">
                  <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                    {copy.data.rightPanel.generatedContent.headline.label}
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {copy.data.rightPanel.generatedContent.headline.content}
                </h2>
                <div className="flex items-center gap-1">
                  <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                    {copy.data.rightPanel.generatedContent.bodyCopy.label}
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <p className="text-sm text-[#65758c] mb-4 leading-relaxed">
                  {copy.data.rightPanel.generatedContent.bodyCopy.content}
                </p>
                <div className="flex items-center gap-1">
                  <div className="text-xs text-[#0a0a0a] font-medium border border-[#e1e8f0] text-center rounded-md px-1 items-center">
                    {copy.data.rightPanel.generatedContent.callToAction.label}
                  </div>
                  <CheckCircle className="text-[#00bd7e] w-2.5 items-center" />
                </div>
                <Button className="w-full bg-[#007bff] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2">
                  {
                    copy.data.rightPanel.generatedContent.callToAction
                      .buttonText
                  }{" "}
                  <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
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
