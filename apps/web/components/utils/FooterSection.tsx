"use client";

import { Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { translations } from "../landing/translations";

type ContentFilter = "copy" | "product" | "social";

const FooterSection = ({ copy }: any) => {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  // const copy = useMemo(() => translations[language], [language]);

  const socials = [
    { icon: Twitter, href: "/" },
    { icon: Linkedin, href: "/" },
    { icon: Github, href: "/" },
    { icon: Mail, href: "/" },
  ];

  const footerExtras = [
    { label: "English", icon: Globe, href: "/" },
    { label: "Status", href: "#" },
    { label: "API", href: "#" },
    { label: "Changelog", href: "#" },
  ];

  return (
    <footer className="-mx-6 space-y-10 border-t border-sky-100 bg-white px-6 py-8 text-sm text-slate-600 shadow-inner md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-5 gap-10 md:gap-16">
        {/* Logo & Socials */}
        <div className="max-w-sm space-y-3 text-center md:text-left">
          <Link
            href="/"
            className="flex justify-start items-center text-lg font-semibold text-slate-900"
          >
            <Image
              src="/logo.svg"
              alt="Front Cloud logo"
              width={36}
              height={36}
              className="shrink-0"
            />
            Front Cloud Creative
          </Link>
          <p className="text-base text-slate-500 mt-2 text-start">
            {copy.footerTagline}
          </p>

          <div className="flex justify-start items-center gap-5 !mt-7">
            {socials.map(({ icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sky-200 transition"
              >
                <Icon className="w-5 h-5 text-slate-700 hover:text-black" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-[5rem] text-start md:text-left md:mx-0">
          {Object.values(copy.footerLinks).map((group) => {
            return (
              <div key={group.heading} className="space-y-3">
                <p className="text-base font-semibold text-slate-900">
                  {group.heading}
                </p>
                <ul className="space-y-3 text-sm text-slate-500">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition hover:text-black"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Links */}
      <div className="flex flex-col gap-4 border-t border-sky-100 pt-6 text-xs sm:text-sm text-[#65758c] md:flex-row md:items-center md:justify-between">
        <p className="text-center text-sm md:text-left">{copy.footerLegal}</p>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 cursor-pointer">
          {footerExtras.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex gap-2 items-center hover:text-black"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3FAFE] border border-sky-100 p-6 sm:p-8 rounded-xl text-center sm:text-left">
        <div className="flex flex-col justify-start items-start">
          <h1 className="text-black font-semibold text-base">Stay updated</h1>
          <p className="text-sm mt-1">
            Get the latest updates about new features and AI improvements.
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-row justify-center sm:justify-end items-center gap-3">
          <input
            type="email"
            placeholder={copy.footerInputPlaceholder}
            className="rounded-lg border border-[#e1e8f0] bg-white px-4 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none h-10"
          />
          <button className="rounded-lg bg-sky-500 px-5 text-white hover:bg-sky-400 py-2.5 font-semibold flex items-center justify-center">
            {copy.footerBottomCta}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
