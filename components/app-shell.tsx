"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Users, Database, CreditCard, UserCircle } from "lucide-react";
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
    { href: "/data", label: t("nav.data"), Icon: Database },
    { href: "/plans", label: t("nav.plans"), Icon: CreditCard },
    { href: "/account", label: t("nav.account"), Icon: UserCircle },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const tab = (href: string, label: string, Icon: typeof Users) => (
    <Link
      key={href}
      href={href}
      aria-current={isActive(href) ? "page" : undefined}
      className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
        isActive(href) ? "text-brand" : "text-slate-600"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen">
      {/* Tablet + desktop sidebar: icon rail at md, full at lg */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-line bg-white p-3 md:flex lg:w-64 lg:p-5">
        <Link href="/dashboard" aria-label={BRAND} className="flex h-10 items-center justify-center lg:justify-start">
          <span className="lg:hidden text-xl font-extrabold text-brand">nx</span>
          <span className="hidden lg:inline"><Logo /></span>
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Main">
          {links.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold lg:justify-start ${
                  active ? "bg-brand-soft text-brand" : "text-slate-600 hover:bg-lavender hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/followups/new"
          aria-label={t("nav.addFollowUp")}
          className="mt-6 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-cta px-3 text-sm font-semibold text-white hover:bg-cta-dark"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="hidden lg:inline">{t("nav.addFollowUp")}</span>
        </Link>

        <div className="mt-auto space-y-4">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
      </aside>

      {/* Phone top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/dashboard" aria-label={BRAND}><Logo /></Link>
        <div className="flex items-center gap-3">
          <Link href="/data" aria-label={t("nav.data")} className="grid h-11 w-11 place-items-center rounded-xl text-slate-600">
            <Database className="h-5 w-5" aria-hidden="true" />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="pb-24 md:pb-0 md:pl-20 lg:pl-64">
        <div className="mx-auto w-full max-w-[1400px]">{children}</div>
      </div>

      {/* Phone bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white md:hidden" aria-label="Main">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pb-2 pt-1">
          {tab("/dashboard", t("nav.dashboard"), LayoutDashboard)}
          {tab("/contacts", t("nav.contacts"), Users)}
          <Link
            href="/followups/new"
            aria-label={t("nav.addFollowUp")}
            className="-mt-6 mx-auto grid h-14 w-14 place-items-center rounded-full bg-cta text-white shadow-lg hover:bg-cta-dark"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </Link>
          {tab("/plans", t("nav.plans"), CreditCard)}
          {tab("/account", t("nav.account"), UserCircle)}
        </div>
      </nav>
    </div>
  );
}
