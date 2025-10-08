"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/brand-voice", label: "Brand Voice" },
  { href: "/generate", label: "Generate" },
  { href: "/billing", label: "Billing" }
];

export const SideNav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "rounded-md px-3 py-2 text-sm font-medium transition",
            pathname === link.href
              ? "bg-gray-200 text-slate-900 dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:bg-gray-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
