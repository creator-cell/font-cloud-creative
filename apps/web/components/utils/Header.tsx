"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop, Zap, ChevronDown, Globe } from "lucide-react";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState<"en" | "ar">("en");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
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

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-md flex items-center gap-1"
                >
                  {theme === "light" && (
                    <Sun className="h-4 w-4 text-[#0A0A0A]" />
                  )}
                  {theme === "dark" && (
                    <Moon className="h-4 w-4 text-[#0A0A0A]" />
                  )}
                  {theme === "system" && (
                    <Laptop className="h-4 w-4 text-[#0A0A0A]" />
                  )}
                  <div>
                    <ChevronDown size={20} className="text-[#64748B]" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="bg-gray-100 rounded-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-md flex items-center gap-1"
                >
                  <Globe className="h-4 w-4 text-slate-700" />

                  <div>
                    <ChevronDown size={20} className="text-[#64748B]" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  <span className={language === "en" ? "font-semibold" : ""}>
                    English
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>
                  <span className={language === "ar" ? "font-semibold" : ""}>
                    العربية
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/signin" className="ml-1 text-sm font-medium">
            Sign In
          </Link>
          <Link href="/get-started">
            <Button className="rounded-md bg-sky-500 text-white hover:bg-sky-400">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
