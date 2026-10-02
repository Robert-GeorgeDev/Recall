"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { BRAND } from "@/lib/brand";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const { t } = useLanguage();

  const steps = [
    { title: t("landing.s1.title"), text: t("landing.s1.text") },
    { title: t("landing.s2.title"), text: t("landing.s2.text") },
    { title: t("landing.s3.title"), text: t("landing.s3.text") },
  ];

  return (
    <main>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-semibold text-brand">
            {t("landing.login")}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 pb-16 pt-12 text-center sm:pt-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {t("landing.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          {t("landing.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
          >
            {t("landing.cta")}
          </Link>
          <a
            href="#how"
            className="rounded-xl border border-line bg-white px-6 py-3 font-semibold text-ink hover:bg-brand-soft"
          >
            {t("landing.how")}
          </a>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-5xl px-5 pb-20">
        <h2 className="text-center text-2xl font-bold">{t("landing.howTitle")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-line bg-white p-6">
              <p className="text-sm font-semibold text-brand">
                {t("landing.step")} {i + 1}
              </p>
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-slate-600">
          <span>
            © {new Date().getFullYear()} {BRAND}
          </span>
          <nav className="flex gap-4" aria-label="Legal">
            <Link href="/privacy" className="hover:text-ink">
              {t("legal.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-ink">
              {t("legal.terms")}
            </Link>
            <Link href="/cookies" className="hover:text-ink">
              {t("legal.cookies")}
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
