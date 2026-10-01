"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/sign-out-button";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/contacts", label: "Contacts" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold ${
                pathname === l.href ? "text-brand" : "text-slate-600 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <SignOutButton />
        </div>
        <Link
          href="/followups/new"
          className="whitespace-nowrap rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
        >
          + Follow-up
        </Link>
      </div>
    </nav>
  );
}
