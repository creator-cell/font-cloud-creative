"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Zap, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";

interface HeaderProps {
  language: "en" | "ar";
  setLanguage: Dispatch<SetStateAction<"en" | "ar">>;
  copy: any;
}

const Header = ({ language, setLanguage, copy }: HeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const navItems = copy?.nav || [
    { label: language === "ar" ? "الميزات" : "Features", href: "#features" },
    { label: language === "ar" ? "الأسعار" : "Pricing", href: "#pricing" },
    { label: language === "ar" ? "حول" : "About", href: "#about" },
    { label: language === "ar" ? "اتصال" : "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-gray-200 backdrop-blur-md lg:max-w-screen-xl lg:mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto ${
        language === "ar" ? "direction-rtl" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex w-full items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold text-slate-900"
        >
          <div className="flex items-center justify-center rounded-lg">
            {/* <Zap className="h-5 w-5 text-white" /> */}
            <Image src={"/logo2.png"} alt="Logo" height={40} width={40} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[#0A0A0A] text-sm font-semibold">
              Front Cloud
            </span>
            <span className="text-[0.70rem] text-[#64748B] font-normal">
              Creative
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#64748B] font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[#0A0A0A]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="md:flex items-center gap-3 hidden">
          {/* Language Selector */}
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-gray-100 rounded-md px-2 py-1 flex items-center justify-center gap-1">
              <div className="flex items-center gap-1 flex-shrink-0">
                {theme === "light" && (
                  <Sun className="h-4 w-4 text-[#0A0A0A]" />
                )}
                {theme === "dark" && (
                  <Moon className="h-4 w-4 text-[#0A0A0A]" />
                )}
                {theme === "system" && (
                  <Laptop className="h-4 w-4 text-[#0A0A0A]" />
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={language}
            onValueChange={(val: "en" | "ar") => setLanguage(val)}
          >
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-gray-100 rounded-md px-2 py-1 flex items-center justify-center gap-1">
              <Globe className="h-4 w-4 text-slate-700" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>

          {/* Auth Buttons */}
          <Link
            href="/api/auth/signin?callbackUrl=%2Fdashboard"
            className="ml-1 text-sm font-medium"
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
