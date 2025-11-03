"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Globe2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Dot,
  CheckCircle,
  Play
} from "lucide-react";
import { fadeIn } from "../animations";

interface DemoSectionProps {
  copy: {
    data: {
      header: {
        platformName: string;
        platformDescription: string;
        demoLabel: string;
        status: string;
      };
      leftPanel: {
        contentBrief: {
          title: string;
          example: string;
        };
        conversionBadge: {
          percentage: string;
          note: string;
        };
        aiProvider: {
          title: string;
          name: string;
          provider: string;
        };
        contentType: {
          title: string;
          type: string;
        };
        toneStyle: {
          title: string;
          styles: string[];
        };
      };
      rightPanel: {
        generatedContent: {
          title: string;
          generating: string;
          headline: {
            label: string;
            content: string;
          };
          bodyCopy: {
            label: string;
            content: string;
          };
          callToAction: {
            label: string;
            buttonText: string;
          };
          tokensUsed: string;
          generatedIn: string;
        };
        actions: {
          tryYourself: string;
          watchDemo: string;
        };
      };
    };
  };
}

export const DemoSection = ({ copy }: DemoSectionProps) => {
  return (
    <motion.section>
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-4 dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:border-[#2a21445e]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <div className="flex items-center justify-center rounded-lg p-1.5">
              <Image src="/logo2.png" alt="Logo" width={36} height={36} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#0A0A0A] text-sm font-semibold dark:text-[#f2f6fa]">
                {copy.data.header.platformName}
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#93a2b8]">
                {copy.data.header.platformDescription}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-50 text-sky-900 px-3 py-0.5 rounded-full text-xs font-medium dark:text-[#e1e8f0] dark:bg-[#1e293b]">
              {copy.data.header.demoLabel}
            </span>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 dark:text-[#00bd72]"></span>
              <span className="text-sky-900 text-sm font-medium dark:text-[#93a2b8]">
                {copy.data.header.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row border-t dark:border-[#324154] border-[#e1e8f0]">
          {/* Left Panel */}
          <div className="w-full md:w-[38%] border-b md:border-b-0 border-gray-200 pr-6 py-6 space-y-5 bg-white dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b]">
            <div className="relative">
              <h3 className="text-sm font-semibold text-black mb-3 dark:text-[#f2f6fa]">
                {copy.data.leftPanel.contentBrief.title}
              </h3>
              <div className="border border-gray-200 rounded-lg bg-[#fafbfc] p-3 text-sm text-gray-800 leading-relaxed pb-14 dark:bg-[#1e293b] dark:text-[#f2f6fa] dark:border-[#2e3b4f]">
                {copy.data.leftPanel.contentBrief.example}
              </div>
              <div className="absolute -bottom-6 -left-12 bg-[#f0f6ff] dark:bg-[#172657] dark:border-[#1a3cb8] rounded-lg px-2 py-3 md:flex items-center gap-2 shadow-lg border border-[#bfdcff] hidden">
                <TrendingUp className="w-4 h-4 text-[#1c5ffc] dark:text-[#145efc]" />
                <div className="flex flex-col">
                  <span className="text-[#1c5ffc] font-medium text-xs dark:text-[#145efc]">
                    {copy.data.leftPanel.conversionBadge.percentage}
                  </span>
                  <span className="text-[#1c5ffc] text-xs dark:text-[#164cc9]">
                    {copy.data.leftPanel.conversionBadge.note}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 dark:text-[#f2f6fa]">
                {copy.data.leftPanel.aiProvider.title}
              </h3>
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-2 bg-[#f9fafb] text-[13px] dark:bg-[#1e293b] dark:border-[#1f2c40]">
                <div className="bg-[#00bd7e] p-1.5 rounded-sm">
                  <Bot className="text-black" size={16} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium dark:text-[#f2f6fa]">
                    {copy.data.leftPanel.aiProvider.name}
                  </p>
                  <p className="text-gray-500 text-[0.60rem] mt-0.5 dark:text-[#93a2b8]">
                    {copy.data.leftPanel.aiProvider.provider}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-1">
              <h3 className="text-sm font-semibold text-black mb-2 dark:text-[#f2f6fa]">
                {copy.data.leftPanel.contentType.title}
              </h3>
              <div className="border border-gray-200 dark:bg-[#1e293b] dark:border-[#324154] dark:text-[#f2f6fa] rounded-lg bg-[#f9fafb] px-2 py-2.5 text-xs text-black">
                {copy.data.leftPanel.contentType.type}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-black mb-2 dark:text-[#f2f6fa]">
                {copy.data.leftPanel.toneStyle.title}
              </h3>
              <div className="flex gap-2 text-[.65rem]">
                {copy.data.leftPanel.toneStyle.styles.map((style) => (
                  <span
                    key={style}
                    className="border items-center border-gray-200 rounded-full bg-[#f0f9ff] font-medium px-1.5 text-[#0c4a6e] text-xs dark:bg-[#1e293b] dark:text-[#e1e8f0]"
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
              <div className="text-sm font-bold text-gray-700 dark:text-[#f2f6fa]">
                {copy.data.rightPanel.generatedContent.title}
              </div>
              <div className="flex items-center">
                <Dot className="w-8 h-auto text-green-500 dark:text-[#0a7d60]" />
                <div className="-ml-1 text-[.70rem] text-green-500 font-medium dark:text-[#008553]">
                  {copy.data.rightPanel.generatedContent.generating}
                </div>
              </div>
            </div>

            <div className="bg-[#edf7fc] border border-[#c3e7fa] rounded-lg p-5 items-center dark:bg-gradient-to-tl from-[#162640] to-[#1c2d45] dark:border-[#224a6b]">
              <div className="flex items-center gap-1">
                <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                  {copy.data.rightPanel.generatedContent.headline.label}
                </div>
                <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 dark:text-[#f2f6fa]">
                {copy.data.rightPanel.generatedContent.headline.content}
              </h2>

              <div className="flex items-center gap-1">
                <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                  {copy.data.rightPanel.generatedContent.bodyCopy.label}
                </div>
                <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
              </div>
              <p className="text-sm text-[#65758c] mb-4 leading-relaxed dark:text-[#93a2b8]">
                {copy.data.rightPanel.generatedContent.bodyCopy.content}
              </p>

              <div className="flex items-center gap-1">
                <div className="text-xs text-[#0a0a0a] font-normal border border-[#e1e8f0] text-center rounded-md px-1 items-center dark:text-[#f2f6fa] dark:border-[#324154]">
                  {copy.data.rightPanel.generatedContent.callToAction.label}
                </div>
                <CheckCircle className="text-[#00bd7e] w-2.5 items-center dark:text-[#00bd7e]" />
              </div>
              <Button className="w-full bg-[#007bff] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2 dark:bg-gradient-to-l from-[#1167fa] to-[#28a9fa]">
                {copy.data.rightPanel.generatedContent.callToAction.buttonText}
                <ArrowRight className="ml-1 w-3 h-3 font-bold text-white" />
              </Button>

              <div className="border-b mt-6 dark:text-[#324154]"></div>
              <div className="flex items-center gap-1 justify-between mt-5">
                <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center dark:text-[#93a2b8]">
                  {copy.data.rightPanel.generatedContent.tokensUsed}
                </div>
                <div className="text-xs text-[#65758c] font-medium text-center px-1 items-center dark:text-[#93a2b8]">
                  {copy.data.rightPanel.generatedContent.generatedIn}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="w-full bg-[#059ced] hover:bg-[#006ae0] text-white text-xs font-medium py-2.5 rounded-md mt-2 dark:bg-gradient-to-l from-[#1167fa] to-[#28a9fa]">
                <Play className="ml-1 w-3 h-3 font-bold text-white" />
                {copy.data.rightPanel.actions.tryYourself}
              </Button>

              <Button className="w-[14rem] bg-white hover:bg-sky-100 text-sm font-medium py-2 rounded-md mt-2 text-black border border-[#e1e8f0] dark:bg-[#1c2a3d] dark:border-[#324154] dark:text-[#f2f6fa]">
                <div className="flex items-center gap-1">
                  <Globe2 className="w-4 h-4" />
                  {copy.data.rightPanel.actions.watchDemo}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};