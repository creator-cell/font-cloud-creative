"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useTheme } from "../theme-provider";

interface HeaderProps {
  language: "en" | "ar";
  setLanguage: Dispatch<SetStateAction<"en" | "ar">>;
  copy: any;
}

const Header = ({ language, setLanguage, copy }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  const navItems = copy?.nav || [
    { label: language === "ar" ? "الميزات" : "Features", href: "#features" },
    { label: language === "ar" ? "الأسعار" : "Pricing", href: "#pricing" },
    { label: language === "ar" ? "حول" : "About", href: "#about" },
    { label: language === "ar" ? "اتصال" : "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b dark:border-b-[#324154] border-gray-200 backdrop-blur-md ${
        language === "ar" ? "direction-rtl" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex w-full items-center justify-between px-6 md:px-8 xl:px-16 py-2">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-base font-semibold text-slate-900"
        >
          <Image src="/logo2.png" alt="Logo" height={40} width={40} />
          <div className="flex flex-col leading-tight">
            <span className="text-[#0A0A0A] text-sm font-semibold dark:text-[#f2f6fa]">
              Front Cloud
            </span>
            <span className="text-[0.70rem] text-[#64748B] font-normal dark:text-[#69758a]">
              Creative
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-[#64748B] font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[#0A0A0A] dark:text-[#8f9eb3] dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="md:flex items-center gap-3 hidden">
          {/* Theme Selector */}
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] rounded-md px-2 flex items-center justify-center gap-2 dark:bg-[#192438] dark:border-[#324154]">
              <div className="flex items-center gap-1">
                {theme === "light" && (
                  <Sun className="h-4 w-4 text-[#0A0A0A] dark:text-[#445063]" />
                )}
                {theme === "dark" && (
                  <Moon className="h-4 w-4 text-[#0A0A0A] dark:text-[#445063]" />
                )}
                {/* {theme === "system" && (
                  <Laptop className="h-4 w-4 text-[#0A0A0A]" />
                )} */}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-[#192438] dark:text-white">
              <SelectItem value="light">
                <div className="flex items-center justify-center gap-1">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center justify-center gap-1">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
              {/* <SelectItem value="system">System</SelectItem> */}
            </SelectContent>
          </Select>

          {/* Language Selector */}
          <Select
            value={language}
            onValueChange={(val: "en" | "ar") => setLanguage(val)}
          >
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] rounded-md px-2 flex items-center justify-center gap-2 dark:bg-[#192438] dark:border-[#324154]">
              <Globe className="h-4 w-4 text-slate-700" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#192438] dark:text-white">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
          <Link
            href="/api/auth/signin?callbackUrl=%2Fdashboard"
            className="ml-1 text-xs font-medium dark:text-[#f2f6fa]"
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
            <button className="rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-2.5 py-1.5 font-semibold text-sm">
              {language === "ar" ? "ابدأ الآن" : "Get Started"}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
