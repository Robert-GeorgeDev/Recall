"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export default function LegalNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Legal">
      {ITEMS.map(({ href, label }) => {
        const active = pathname === href;
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
