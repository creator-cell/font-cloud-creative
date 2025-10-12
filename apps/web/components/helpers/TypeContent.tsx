"use client";

import { motion } from "framer-motion";
import { Sparkles, BarChart2, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const cards = [
  {
    title: "Ad Copy",
    description: "Headlines, hooks, body text, and CTAs that convert",
    Icon: Sparkles,
    color: "blue",
  },
  {
    title: "Social Carousels",
    description: "Multi-slide content for Instagram, LinkedIn, and more",
    Icon: BarChart2,
    color: "green",
  },
  {
    title: "Blog Posts",
    description: "SEO-optimized articles with proper structure and keywords",
    Icon: MessageSquare,
    color: "purple",
  },
];

const TypeContent = ({ copy }: any) => {
  const fadeIn = (delay = 0, y = 20) => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: true },
  });

  const getColor = (color: string) => {
    switch (color) {
      case "blue":
        return {
          text: "text-blue-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
        };
      case "green":
        return {
          text: "text-green-500",
          bg: "bg-green-50",
          border: "border-green-200",
        };
      case "purple":
        return {
          text: "text-purple-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
        };
      default:
        return { text: "", bg: "", border: "" };
    }
  };

  return (
    <section className="pb-20 bg-[#F9FBFD] text-center">
      <motion.div {...fadeIn(0)}>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          {copy.TypeTitle}
        </h2>
        <p className="mt-4 text-gray-500 text-[17px] md:text-lg">
          {copy.TypeDescription}
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const { text, bg, border } = getColor(card.color);
          const Icon = card.Icon as LucideIcon;

          return (
            <motion.div
              key={card.title}
              {...fadeIn(index * 0.2)}
              className="rounded-2xl bg-white border border-gray-200 shadow-sm  transition-colors duration-300 cursor-pointer p-10 flex flex-col items-center text-center"
            >
              <div
                className={`flex items-center justify-center h-16 w-16 rounded-full ${bg} mb-6`}
              >
                <Icon className={`h-8 w-8 ${text}`} />
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TypeContent;
