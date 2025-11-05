"use client";

import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, Mail, Globe, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

interface FooterProps {
  copy: {
    footerTagline: string;
    footerLinks: Record<string, FooterLinkGroup>;
    footerLegal: string;
    footerInputPlaceholder: string;
    footerBottomCta: string;
  };
}

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

const fadeIn = (delay = 0, offset = 40) => ({
  initial: { opacity: 0, y: -offset },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay },
  viewport: { once: false, amount: 0.3 },
});

export const FooterSection = ({ copy }: FooterProps) => {
  return (
    <footer className="mt-12 md:mt-16 -mx-6 space-y-10 border-t border-sky-100 bg-white px-6 py-8 text-sm text-slate-600 shadow-inner md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24 dark:bg-[#1e293b]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-5 gap-10 md:gap-16">
        <div className="max-w-sm space-y-3 text-center md:text-left">
          <Link
            href="/"
            className="flex justify-start items-center gap-2 text-lg font-semibold text-slate-900 dark:text-[#f1f2ed]"
          >
            <Image
              src="/logo2.png"
              alt="Front Cloud logo"
              width={28}
              height={28}
              className="mt-1"
            />
            Front Cloud
          </Link>
          <p className="text-base text-slate-500 mt-2 text-start dark:text-[#93a2b8]">
            {copy.footerTagline}
          </p>

          <div className="flex justify-start items-center gap-5 !mt-7">
            {socials.map(({ icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sky-200 transition"
              >
                <Icon className="w-5 h-5 text-slate-700 hover:text-black dark:text-[#f2f6fa]" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-[5rem] text-start md:text-left md:mx-0">
          {Object.values(copy.footerLinks).map((group) => (
            <div key={group.heading} className="space-y-3">
              <p className="text-base font-semibold text-slate-900 dark:text-[#f2f6fa]">
                {group.heading}
              </p>
              <ul className="space-y-3 text-sm text-slate-500">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-black dark:text-[#93a2b8]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t dark:border-[#324154] border-sky-100 pt-6 text-xs sm:text-sm text-[#65758c] md:flex-row md:items-center md:justify-between">
        <p className="text-center text-sm md:text-left dark:text-[#93a2b8]">
          {copy.footerLegal}
        </p>
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 cursor-pointer">
          {footerExtras.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex gap-2 items-center hover:text-black dark:text-[#93a2b8]"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#F3FAFE] border border-sky-100 p-6 sm:p-8 rounded-xl text-center sm:text-left dark:bg-[#203145] dark:border-[#243f57]">
        <div className="flex flex-col justify-start items-start">
          <h1 className="text-black font-semibold text-base dark:text-[#f2f6fa]">
            Stay updated
          </h1>
          <p className="text-sm mt-1 dark:text-[#9382b8]">
            Get the latest updates about new features and AI improvements.
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-row justify-center sm:justify-end items-center gap-3">
          <input
            type="email"
            placeholder={copy.footerInputPlaceholder}
            className="rounded-lg border border-[#e1e8f0] bg-white px-4 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none h-10 dark:bg-[#0f1729] dark:border-[#324154] dark:text-[#088691]"
          />
          <button className="rounded-lg bg-sky-500 px-5 text-white hover:bg-sky-400 py-2.5 font-semibold flex items-center justify-center dark:bg-[#39b2f7] dark:text-[#0f1729]">
            {copy.footerBottomCta}
          </button>
        </div>
      </div>
    </footer>
  );
};
