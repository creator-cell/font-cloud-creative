"use client";

import { Button } from "@/components/ui/button";
import { useDashboardLocale } from "@/components/dashboard-locale-context";

export const DashboardLangToggle = () => {
  const { lang, setLang } = useDashboardLocale();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={lang === "ar" ? "default" : "outline"}
        className={lang === "ar" ? "bg-sky-500 text-white hover:bg-sky-400" : undefined}
        onClick={() => setLang("ar")}
      >
        العربية
      </Button>
      <Button
        size="sm"
        variant={lang === "en" ? "default" : "outline"}
        className={lang === "en" ? "bg-sky-500 text-white hover:bg-sky-400" : undefined}
        onClick={() => setLang("en")}
      >
        English
      </Button>
    </div>
  );
};
