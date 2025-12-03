"use client";
import { useState } from "react";

const tabs = ["Overview", "Resources", "Controls", "FAQ"];

export default function SecurityTabs({ onChange }: any) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(index);
  };

  return (
    <div className="border-b flex gap-8 mt-4">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => handleClick(index)}
          className={`pb-2 text-base font-semibold  ${
            activeIndex === index
              ? "border-b-2 border-blue-600 text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
