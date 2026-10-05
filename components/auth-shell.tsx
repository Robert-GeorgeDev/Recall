"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-sm px-5 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </div>
      {children}
    </main>
  );
}

export const authInput =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
