"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Lang = "en" | "ar";

type TranslationMap = Record<string, { en: string; ar: string }>;

const translations: TranslationMap = {
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  projects: { en: "Projects", ar: "المشاريع" },
  frontCloudAi: { en: "Front Cloud AI", ar: "فرونت كلاود للذكاء الاصطناعي" },
  brandVoice: { en: "Brand Voice", ar: "هوية العلامة" },
  aiAnalysis: { en: "AI Analysis", ar: "تحليل بالذكاء الاصطناعي" },
  generate: { en: "Generate", ar: "إنشاء" },
  wallet: { en: "Wallet", ar: "المحفظة" },
  billing: { en: "Billing", ar: "الفوترة" },
  settings: { en: "Settings", ar: "الإعدادات" },
  createContent: { en: "Create Content", ar: "إنشاء محتوى" },
  logout: { en: "Log out", ar: "تسجيل الخروج" },
  plan: { en: "plan", ar: "خطة" }
};

type DashboardLocaleContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations) => string;
};

const DashboardLocaleContext = createContext<DashboardLocaleContextValue | undefined>(undefined);
const STORAGE_KEY = "fcc-dashboard-lang";

const applyDirection = (lang: Lang) => {
  if (typeof document === "undefined") return;
  const isRtl = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", isRtl);
};

export const DashboardLocaleProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const saved =
      (typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null) ?? "en";
    setLangState(saved);
    applyDirection(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyDirection(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const t = useCallback(
    (key: keyof typeof translations) => translations[key]?.[lang] ?? translations[key]?.en ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <DashboardLocaleContext.Provider value={value}>{children}</DashboardLocaleContext.Provider>;
};

export const useDashboardLocale = () => {
  const ctx = useContext(DashboardLocaleContext);
  if (!ctx) throw new Error("useDashboardLocale must be used within DashboardLocaleProvider");
  return ctx;
};
