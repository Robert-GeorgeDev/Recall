"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

const ITEMS = [
  { href: "/privacy", en: "Privacy", ro: "Confidențialitate" },
  { href: "/terms", en: "Terms", ro: "Termeni" },
  { href: "/cookies", en: "Cookies", ro: "Cookies" },
  { href: "/subprocessors", en: "Subprocessors", ro: "Subprocesatori" },
  { href: "/security", en: "Security", ro: "Securitate" },
  { href: "/company", en: "Company", ro: "Companie" },
];

export default function LegalNav() {
  const pathname = usePathname() ?? "";
  const { lang } = useLanguage();
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Legal">
      {ITEMS.map(({ href, en, ro }) => {
        const active = pathname === href;
        const label = lang === "ro" ? ro : en;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              active
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-white text-slate-600 hover:border-brand hover:text-brand"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
