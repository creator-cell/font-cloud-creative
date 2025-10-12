import {
  Check,
  Sparkles,
  Wand2,
  MessageSquare,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const CardTitle = ({ children, className }) => (
  <h4 className={`text-lg font-semibold ${className}`}>{children}</h4>
);

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.3 },
});

const WorkDemo = ({ copy }: any) => {
  const workflowSteps = [
    {
      title: "1. Describe Your Needs",
      description:
        "Tell us what content you want to create and your target audience",
      Icon: MessageSquare,
      iconColor: "text-sky-600",
      borderColor: "border-sky-300",
      bgColor: "bg-white",
      style: {
        border: "1px solid #c7d2fe",
      },
    },
    {
      title: "2. AI Magic Happens",
      description:
        "Multiple AI models work together to create optimized content",
      Icon: Sparkles,
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-300",
      bgColor: "bg-white",
      style: {
        border: "1px solid #a7f3d0",
      },
    },
    {
      title: "3. Get Perfect Content",
      description: "Receive ready-to-use content in multiple formats instantly",
      Icon: Wand2,
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-300",
      bgColor: "bg-white",
      style: {
        border: "1px solid #c4b5fd",
      },
    },
  ];
  const speedFeatureIcons: LucideIcon[] = [MessageSquare, Sparkles, Wand2];

  const speedFeatures = (copy.speedFeatures || []).map(
    (feature: { title: string; description: string }, index: number) => ({
      ...feature,
      Icon: speedFeatureIcons[index] ?? Sparkles,
    })
  );

  return (
    <motion.section
      className="space-y-6 pb-8 bg-white"
      id="solutions"
      {...fadeIn(0.1)}
    >
      <motion.div
        className="text-center"
        {...fadeIn(0.05, 10)}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center text-xs font-medium border border-gray-300 p-1 rounded-xl">
          <Sparkles className="w-4 h-4 mr-1" />
          {copy.speedDemo}
        </span>
      </motion.div>

      <motion.div className="space-y-4 text-center" {...fadeIn(0.1, 20)}>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          {copy.speedTitle}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">
            {copy.speedTitleSecond}
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-600">
          {copy.speedSubtitle}
        </p>
      </motion.div>

      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute -bottom-20 left-[45%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
            style={{ animationDelay: "-2s" }}
          ></div>
        </div>

        {speedFeatures.map(
          ({ title, description, Icon, iconColor, style }, index) => (
            <motion.div
              key={title}
              className="relative rounded-2xl p-4 h-full flex flex-col justify-between"
              style={{
                ...style,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
              }}
              {...fadeIn(index * 0.2)}
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`p-2 rounded-full bg-white border ${
                      iconColor === "text-sky-600"
                        ? "border-sky-300"
                        : iconColor === "text-emerald-600"
                          ? "border-emerald-300"
                          : "border-indigo-300"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {title}
                  </CardTitle>
                </div>
                <p className="text-base text-slate-600 mt-2">{description}</p>
              </div>

              {index === 2 && (
                <div className="absolute -top-2 right-16 p-4 rounded-xl bg-green-100/70 border border-green-300 shadow-lg translate-x-1/2 -translate-y-1/2 hidden md:block">
                  <div className="flex items-center text-emerald-600">
                    <Check className="w-5 h-5 mr-1" />
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {copy.speedContent}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-500 mt-0.5 whitespace-nowrap">
                    {copy.speedReady}
                  </p>
                </div>
              )}
            </motion.div>
          )
        )}
      </div>
    </motion.section>
  );
};

export default WorkDemo;
