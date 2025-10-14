"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Globe, X, MenuIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useTheme } from "../theme-provider";

interface HeaderProps {
  language: "en" | "ar";
  setLanguage: Dispatch<SetStateAction<"en" | "ar">>;
  copy: any;
}

const Header = ({ language, setLanguage, copy }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          className="flex items-center gap-1.5 text-base font-semibold text-slate-900 dark:text-white"
        >
          <Image src="/logo2.png" alt="Logo" height={40} width={40} />
          <div className="flex flex-col leading-tight">
            <span className="text-[#0A0A0A] text-sm font-semibold dark:text-[#f2f6fa]">
              Front Cloud
            </span>
            <span className="text-[0.70rem] text-[#64748B] font-normal dark:text-white">
              Creative
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-medium text-[#64748B] font-semibold dark:text-white">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[#0A0A0A] dark:text-white dark:hover:text-white"
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
            className="ml-1 text-xs font-medium dark:text-white"
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
            <button className="rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-2.5 py-1.5 font-semibold text-sm">
              {language === "ar" ? "ابدأ الآن" : "Get Started"}
            </button>
          </Link>
        </div>
        <button
          className="md:hidden flex items-center p-2 dark:hover:bg-[#1e293b] rounded-md cursor-pointer hover:bg-[#F3FAFE]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X size={16} className="dark:text-white text-black" />
          ) : (
            <MenuIcon size={16} className="text-black dark:text-white" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-[#324154] border-gray-200 px-4 sm:px-6">
          <ul className="flex flex-col gap-1 px-2 space-y-1 pt-2 pb-3 text-sm text-[#778599] font-medium dark:text-white">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block w-full px-3 py-2 text-sm font-medium transition hover:text-[#0A0A0A] dark:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/*  */}
            <div className="border-b border-[#e1e8f0] dark:border-[#324154]"></div>
            {/* theme */}
            <div>
              <li className="flex items-center justify-between px-2 space-y-1 pt-2 pb-2 text-sm  font-medium">
                <div className="text-black dark:text-white">Theme</div>
                <div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2 flex items-center justify-center gap-10">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {theme === "light" && (
                          <Sun className="h-4 w-4 text-[#0A0A0A]" />
                        )}
                        {theme === "dark" && (
                          <Moon className="h-4 w-4 text-[#0A0A0A]" />
                        )}
                        {/* {theme === "system" && (
                          <Laptop className="h-4 w-4 text-[#0A0A0A]" />
                        )} */}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black dark:bg-[#192438] dark:text-white">
                      <SelectItem value="light">
                        <div className="flex items-center justify-center gap-1 dark:text-[#d3d8d2]">
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
                    </SelectContent>
                  </Select>
                </div>
              </li>

              <li className="flex items-center justify-between px-2 space-y-1 pt-2  text-sm  font-medium">
                <div className="text-black dark:text-white">Language</div>
                <div>
                  <Select
                    value={language}
                    onValueChange={(val: "en" | "ar") => setLanguage(val)}
                  >
                    <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2  flex items-center justify-center gap-10">
                      <Globe className="h-4 w-4 text-slate-700" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#192438] dark:text-white">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </li>
            </div>
            {/* auth prop */}

            <li>
              <Link
                href="/api/auth/signin?callbackUrl=%2Fdashboard"
                className="block w-full pb-1  font-medium text-sm text-center text-black dark:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {language === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Link>
            </li>

            <li className="flex justify-center pb-1.5">
              <Link
                href="/api/auth/signin?callbackUrl=%2Fdashboard"
                onClick={() => setMobileOpen(false)}
              >
                <button className="w-[320px] rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-1.5 py-1.5 font-semibold text-sm mt-1">
                  {language === "ar" ? "ابدأ الآن" : "Get Started"}
                </button>
              </Link>
            </li>

            {/*  */}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
