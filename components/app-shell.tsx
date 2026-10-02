"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FileSpreadsheet, LayoutDashboard, Plus, Users } from "lucide-react";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import SignOutButton from "@/components/sign-out-button";
import { useLanguage } from "@/components/language-provider";
import { BRAND } from "@/lib/brand";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { t } = useLanguage();

  const links = [
    { href: "/dashboard", label: t("nav.dashboard"), Icon: LayoutDashboard },
    { href: "/contacts", label: t("nav.contacts"), Icon: Users },
    { href: "/data", label: t("nav.data"), Icon: FileSpreadsheet },
    { href: "/plans", label: t("nav.plans"), Icon: CreditCard },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white p-5 md:flex">
        <Link href="/dashboard" aria-label={BRAND}>
          <Logo />
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Main">
          {links.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-slate-600 hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/followups/new"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white hover:bg-cta-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("nav.addFollowUp")}
        </Link>

        <div className="mt-auto space-y-4">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
      </header>

      <div className="pb-24 md:pb-0 md:pl-64">{children}</div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white md:hidden"
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 items-end px-4 pb-2 pt-1">
          <Link
            href="/dashboard"
            aria-current={isActive("/dashboard") ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-xs font-semibold ${
              isActive("/dashboard") ? "text-brand" : "text-slate-600"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            {t("nav.dashboard")}
          </Link>

          <Link
            href="/followups/new"
            aria-label={t("nav.addFollowUp")}
            className="-mt-6 mx-auto grid h-14 w-14 place-items-center rounded-full bg-cta text-white shadow-lg hover:bg-cta-dark"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </Link>

          <Link
            href="/contacts"
            aria-current={isActive("/contacts") ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-xs font-semibold ${
              isActive("/contacts") ? "text-brand" : "text-slate-600"
            }`}
          >
            <Users className="h-5 w-5" aria-hidden="true" />
            {t("nav.contacts")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
