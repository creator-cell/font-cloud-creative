"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Zap, Globe, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState<"en" | "ar">("en");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold text-slate-900"
        >
          <div className="flex items-center justify-center rounded-lg bg-sky-500 p-1.5">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[#0A0A0A]">Front Cloud</span>
            <span className="text-xs text-[#64748B]">Creative</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#64748B] font-semibold">
          <Link href="#features" className="transition hover:text-[#0A0A0A]">
            Features
          </Link>
          <Link href="#pricing" className="transition hover:text-[#0A0A0A]">
            Pricing
          </Link>
          <Link href="#about" className="transition hover:text-[#0A0A0A]">
            About
          </Link>
          <Link href="#contact" className="transition hover:text-[#0A0A0A]">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
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

          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-gray-100 rounded-md px-2 py-1 flex items-center justify-center gap-1">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Globe className="h-4 w-4 text-slate-700" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>

          {/* Auth Buttons */}
          <Link href="/signin" className="ml-1 text-sm font-medium">
            Sign In
          </Link>
          <Link href="/get-started">
            <Button className="rounded-lg bg-sky-500 text-white hover:bg-sky-400">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
