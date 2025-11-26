import {
  Check,
  CheckCircle2,
  Crown,
  Rocket,
  UsersRound,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../landing/translations";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { CardTitle } from "../ui/card";
import { CardHeader } from "../ui/card";
import { Card } from "../ui/card";
import Link from "next/link";

const whatsappLink = "https://wa.me/966504576354";

const EnterpriseSolution = ({ copy }: any) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const fadeIn = (delay = 0, offset = 40) => ({
    initial: { opacity: 0, y: -offset },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay },
    viewport: { once: false, amount: 0.3 },
  });
  // const copy = useMemo(() => translations[language], [language]);

  return (
    <motion.div {...fadeIn(0.1)}>
      <Card className="rounded-3xl border border-sky-300 !bg-gradient-to-r !from-[#fafbfc] !to-[#f0f6ff] p-8 text-center text-slate-900 shadow-xl dark:border-transparent dark:bg-gradient-to-br dark:from-sky-300/60 dark:via-white dark:to-sky-200/60 dark:text-slate-900">
        <CardHeader className="">
          <div className="flex bg-[#dcf0fa] justify-center items-center mx-auto w-16 h-16 rounded-full mt-2">
            <span className="text-[#0ea3e8] items-center">
              {" "}
              <Crown size={35} />
            </span>
          </div>
          <CardTitle className="text-2xl text-black font-bold mt-3">
            {copy.enterpriseTitle}
          </CardTitle>
          <p className="text-base text-[slate-900] dark:text-[#65758c]">
            {copy.enterpriseSubtitle}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4 text-slate-900 dark:text-slate-900 mt-6">
          <Button
            size="lg"
            className="rounded-full bg-white  text-black hover:bg-sky-200 border border-slate-300 w-full sm:w-fit"
            asChild
          >
            <Link href={whatsappLink} target="_blank">
              {copy.enterpriseCta}
            </Link>
          </Button>
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-[#09a0eb] to-[#0773f7] text-white hover:bg-slate-800 w-full sm:w-fit"
            asChild
          >
            <Link href={whatsappLink} target="_blank">
              {copy.enterpriseCta2}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnterpriseSolution;
