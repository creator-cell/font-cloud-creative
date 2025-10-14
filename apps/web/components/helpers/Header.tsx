// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Sun, Moon, Laptop, Globe, X, MenuIcon } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Image from "next/image";
// import { useState, type Dispatch, type SetStateAction } from "react";
// import { useTheme } from "../theme-provider";

// interface HeaderProps {
//   language: "en" | "ar";
//   setLanguage: Dispatch<SetStateAction<"en" | "ar">>;
//   copy: any;
// }

// const Header = ({ language, setLanguage, copy }: HeaderProps) => {
//   const { theme, setTheme } = useTheme();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const navItems = copy?.nav || [
//     { label: language === "ar" ? "الميزات" : "Features", href: "#features" },
//     { label: language === "ar" ? "الأسعار" : "Pricing", href: "#pricing" },
//     { label: language === "ar" ? "حول" : "About", href: "#about" },
//     { label: language === "ar" ? "اتصال" : "Contact", href: "#contact" },
//   ];

//   return (
//     <header
//       className={`fixed inset-x-0 top-0 z-50 border-b dark:border-b-[#324154] border-gray-200 backdrop-blur-md ${
//         language === "ar" ? "direction-rtl" : ""
//       }`}
//       dir={language === "ar" ? "rtl" : "ltr"}
//     >
//       <div className="mx-auto flex w-full items-center justify-between px-6 md:px-8 xl:px-16 py-2">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="flex items-center gap-1.5 text-base font-semibold text-slate-900"
//         >
//           <Image src="/logo2.png" alt="Logo" height={40} width={40} />
//           <div className="flex flex-col leading-tight">
//             <span className="text-[#0A0A0A] text-sm font-semibold dark:text-[#f2f6fa]">
//               Front Cloud
//             </span>
//             <span className="text-[0.70rem] text-[#64748B] font-normal dark:text-[#69758a]">
//               Creative
//             </span>
//           </div>
//         </Link>

//         {/* Nav */}
//         <nav className="hidden md:flex items-center gap-6 text-xs text-[#64748B] font-semibold">
//           {navItems.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               className="transition hover:text-[#0A0A0A] dark:text-[#8f9eb3] dark:hover:text-white"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         {/* Actions */}
//         <div className="md:flex items-center gap-3 hidden">
//           {/* Theme Selector */}
//           <Select value={theme} onValueChange={setTheme}>
//             <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] rounded-md px-2 flex items-center justify-center gap-2 dark:bg-[#192438] dark:border-[#324154]">
//               <div className="flex items-center gap-1">
//                 {theme === "light" && (
//                   <Sun className="h-4 w-4 text-[#0A0A0A] dark:text-[#445063]" />
//                 )}
//                 {theme === "dark" && (
//                   <Moon className="h-4 w-4 text-[#0A0A0A] dark:text-[#445063]" />
//                 )}
//                 {/* {theme === "system" && (
//                   <Laptop className="h-4 w-4 text-[#0A0A0A]" />
//                 )} */}
//               </div>
//             </SelectTrigger>
//             <SelectContent className="bg-white text-black dark:bg-[#192438] dark:text-white">
//               <SelectItem value="light">
//                 <div className="flex items-center justify-center gap-1">
//                   <Sun className="h-4 w-4" />
//                   Light
//                 </div>
//               </SelectItem>
//               <SelectItem value="dark">
//                 <div className="flex items-center justify-center gap-1">
//                   <Moon className="h-4 w-4" />
//                   Dark
//                 </div>
//               </SelectItem>
//               {/* <SelectItem value="system">System</SelectItem> */}
//             </SelectContent>
//           </Select>

//           {/* Language Selector */}
//           <Select
//             value={language}
//             onValueChange={(val: "en" | "ar") => setLanguage(val)}
//           >
//             <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] rounded-md px-2 flex items-center justify-center gap-2 dark:bg-[#192438] dark:border-[#324154]">
//               <Globe className="h-4 w-4 text-slate-700" />
//             </SelectTrigger>
//             <SelectContent className="dark:bg-[#192438] dark:text-white">
//               <SelectItem value="en">English</SelectItem>
//               <SelectItem value="ar">العربية</SelectItem>
//             </SelectContent>
//           </Select>
//           <Link
//             href="/api/auth/signin?callbackUrl=%2Fdashboard"
//             className="ml-1 text-xs font-medium dark:text-[#f2f6fa]"
//           >
//             {language === "ar" ? "تسجيل الدخول" : "Sign In"}
//           </Link>
//           <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
//             <button className="rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-2.5 py-1.5 font-semibold text-sm">
//               {language === "ar" ? "ابدأ الآن" : "Get Started"}
//             </button>
//           </Link>
//         </div>
//         <button
//           className="md:hidden flex items-center p-2 hover:bg-[#1e293b] rounded-md"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? (
//             <X size={16} className="dark:text-white text-black" />
//           ) : (
//             <MenuIcon size={16} className="text-black dark:text-white" />
//           )}
//         </button>
//       </div>

//       {mobileOpen && (
//         <nav className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-[#324154] border-gray-200 px-4 sm:px-6">
//           <ul className="flex flex-col gap-1 px-2 space-y-1 pt-2 pb-3 text-sm text-[#778599] font-medium">
//             {navItems.map((item) => (
//               <li key={item.label}>
//                 <Link
//                   href={item.href}
//                   className="block w-full px-3 py-2 text-sm font-medium transition hover:text-[#0A0A0A] dark:text-[#93a2b8]"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//             {/*  */}
//             <div className="border-b border-[#e1e8f0] dark:border-[#324154]"></div>
//             {/* theme */}
//             <div>
//               <li className="flex items-center justify-between px-2 space-y-1 pt-2 pb-2 text-sm  font-medium">
//                 <div className=" dark:text-[#d3d8d2] text-black">Theme</div>
//                 <div>
//                   <Select value={theme} onValueChange={setTheme}>
//                     <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2 flex items-center justify-center gap-10">
//                       <div className="flex items-center gap-1 flex-shrink-0">
//                         {theme === "light" && (
//                           <Sun className="h-4 w-4 text-[#0A0A0A]" />
//                         )}
//                         {theme === "dark" && (
//                           <Moon className="h-4 w-4 text-[#0A0A0A]" />
//                         )}
//                         {/* {theme === "system" && (
//                           <Laptop className="h-4 w-4 text-[#0A0A0A]" />
//                         )} */}
//                       </div>
//                     </SelectTrigger>
//                     <SelectContent className="bg-white text-black dark:bg-[#192438] dark:text-white">
//                       <SelectItem value="light">
//                         <div className="flex items-center justify-center gap-1 text-[#d3d8d2]">
//                           <Sun className="h-4 w-4" />
//                           Light
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="dark">
//                         <div className="flex items-center justify-center gap-1">
//                           <Moon className="h-4 w-4" />
//                           Dark
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </li>

//               <li className="flex items-center justify-between px-2 space-y-1 pt-2  text-sm  font-medium">
//                 <div className="text-black dark:text-[#d3d8d2]">Language</div>
//                 <div>
//                   <Select
//                     value={language}
//                     onValueChange={(val: "en" | "ar") => setLanguage(val)}
//                   >
//                     <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2  flex items-center justify-center gap-10">
//                       <Globe className="h-4 w-4 text-slate-700" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-[#192438] dark:text-white">
//                       <SelectItem value="en">English</SelectItem>
//                       <SelectItem value="ar">العربية</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </li>
//             </div>
//             {/* auth prop */}

//             <li>
//               <Link
//                 href="/api/auth/signin?callbackUrl=%2Fdashboard"
//                 className="block w-full pb-1  font-medium text-sm text-center text-black dark:text-[#f2f6fa]"
//                 onClick={() => setMobileOpen(false)}
//               >
//                 {language === "ar" ? "تسجيل الدخول" : "Sign In"}
//               </Link>
//             </li>

//             <li className="flex justify-center pb-1.5">
//               <Link
//                 href="/api/auth/signin?callbackUrl=%2Fdashboard"
//                 onClick={() => setMobileOpen(false)}
//               >
//                 <button className="w-[320px] rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-1.5 py-1.5 font-semibold text-sm mt-1">
//                   {language === "ar" ? "ابدأ الآن" : "Get Started"}
//                 </button>
//               </Link>
//             </li>

//             {/*  */}
//           </ul>
//         </nav>
//       )}
//     </header>
//   );
// };

// export default Header;

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Globe, X, MenuIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import React, { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { useTheme } from "../theme-provider";

interface HeaderProps {
  language: "en" | "ar";
  setLanguage: Dispatch<SetStateAction<"en" | "ar">>;
  copy: any;
}

const Header = ({ language, setLanguage, copy }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Memoize nav items so it doesn’t recreate on every render
  const navItems = useMemo(
    () =>
      copy?.nav || [
        {
          label: language === "ar" ? "الميزات" : "Features",
          href: "#features",
        },
        { label: language === "ar" ? "الأسعار" : "Pricing", href: "#pricing" },
        { label: language === "ar" ? "حول" : "About", href: "#about" },
        { label: language === "ar" ? "اتصال" : "Contact", href: "#contact" },
      ],
    [language, copy]
  );

  return (
    <header
      // ✅ fix flicker by forcing GPU layer & stable layout
      style={{ transform: "translateZ(0)", willChange: "transform" }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-gray-200 dark:border-b-[#324154] backdrop-blur-md bg-white/70 dark:bg-[#0f1729]/80 transition-colors duration-300`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between px-6 md:px-8 xl:px-16 py-2 ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
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
            <span className="text-[0.70rem] text-[#64748B] font-normal dark:text-[#69758a]">
              Creative
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
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
            </SelectContent>
          </Select>

          {/* Language Selector */}
          <Select
            value={language}
            onValueChange={(val: "en" | "ar") => setLanguage(val)}
          >
            <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] rounded-md px-2 flex items-center justify-center gap-2 dark:bg-[#192438] dark:border-[#324154]">
              <Globe className="h-4 w-4 text-slate-700 dark:text-[#a0aec0]" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#192438] dark:text-white">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>

          {/* Auth Buttons */}
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

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex items-center p-2 hover:bg-[#e6eefc] dark:hover:bg-[#1e293b] rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X size={18} className="dark:text-white text-black" />
          ) : (
            <MenuIcon size={18} className="text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-[#0f1729] border-t border-gray-200 dark:border-[#324154] px-4 sm:px-6 transition-all duration-300">
          <ul
            className={`flex flex-col gap-1 px-2 space-y-1 pt-2 pb-3 text-sm text-[#778599] font-medium ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block w-full px-3 py-2 text-sm font-medium transition hover:text-[#0A0A0A] dark:text-[#93a2b8] dark:hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <div className="border-b border-[#e1e8f0] dark:border-[#324154]"></div>

            {/* Theme Selector (Mobile) */}
            <li className="flex items-center justify-between px-2 py-2 text-sm font-medium">
              <span className="dark:text-[#d3d8d2] text-black">Theme</span>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2 flex items-center justify-center gap-2">
                  {theme === "light" && (
                    <Sun className="h-4 w-4 text-[#0A0A0A]" />
                  )}
                  {theme === "dark" && (
                    <Moon className="h-4 w-4 text-[#0A0A0A]" />
                  )}
                </SelectTrigger>
                <SelectContent className="bg-white text-black dark:bg-[#192438] dark:text-white">
                  <SelectItem value="light">
                    <Sun className="h-4 w-4" /> Light
                  </SelectItem>
                  <SelectItem value="dark">
                    <Moon className="h-4 w-4" /> Dark
                  </SelectItem>
                </SelectContent>
              </Select>
            </li>

            {/* Language Selector (Mobile) */}
            <li className="flex items-center justify-between px-2 py-2 text-sm font-medium">
              <span className="text-black dark:text-[#d3d8d2]">Language</span>
              <Select
                value={language}
                onValueChange={(val: "en" | "ar") => setLanguage(val)}
              >
                <SelectTrigger className="w-auto min-w-[2.5rem] border-0 bg-[#f7fafc] dark:bg-[#1a2438] rounded-md px-2 flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4 text-slate-700 dark:text-[#a0aec0]" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#192438] dark:text-white">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </li>

            {/* Auth Links */}
            <li>
              <Link
                href="/api/auth/signin?callbackUrl=%2Fdashboard"
                className="block w-full pb-1 text-center text-sm font-medium text-black dark:text-[#f2f6fa]"
                onClick={() => setMobileOpen(false)}
              >
                {language === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Link>
            </li>
            <li className="flex justify-center pb-2">
              <Link
                href="/api/auth/signin?callbackUrl=%2Fdashboard"
                onClick={() => setMobileOpen(false)}
              >
                <button className="w-[320px] rounded-lg bg-sky-500 text-white hover:bg-sky-400 px-1.5 py-1.5 font-semibold text-sm">
                  {language === "ar" ? "ابدأ الآن" : "Get Started"}
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

// ✅ Prevent unnecessary re-renders
export default React.memo(Header);
