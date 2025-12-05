"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const tabs = ["Overview", "Resources", "Controls", "FAQ"];

export default function SecurityTabs({
  onChange,
  activeIndex,
}: {
  onChange: (index: number) => void;
  activeIndex: number;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelect = (index: number) => {
    onChange(index);
  };

  return (
    <>
      {isMobile && (
        <div className="w-full mt-4">
          <Select
            value={tabs[activeIndex]}
            onValueChange={(v) => handleSelect(tabs.indexOf(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>

            <SelectContent className="w-[var(--radix-select-trigger-width)]">
              {tabs.map((tab) => (
                <SelectItem key={tab} value={tab}>
                  {tab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isMobile && (
        <div className="border-b dark:border-[#324154] flex gap-8 mt-4">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleSelect(index)}
              className={`pb-2 text-sm font-semibold ${
                activeIndex === index
                  ? "border-b-2 border-blue-600 text-black dark:text-white"
                  : "text-gray-500 hover:text-black dark:hover:text-gray-300 dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
