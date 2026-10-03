"use client";

import Link from "next/link";
import {
  Briefcase,
  CalendarCheck,
  Check,
  FileSpreadsheet,
  Flag,
  History,
  Languages,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { BRAND } from "@/lib/brand";
import type { Key } from "@/lib/dictionaries";

const features: { Icon: LucideIcon; title: Key; text: Key }[] = [
  { Icon: CalendarCheck, title: "land.f1.title", text: "land.f1.text" },
  { Icon: ListChecks, title: "land.f2.title", text: "land.f2.text" },
  { Icon: Flag, title: "land.f3.title", text: "land.f3.text" },
  { Icon: History, title: "land.f4.title", text: "land.f4.text" },
  { Icon: FileSpreadsheet, title: "land.f5.title", text: "land.f5.text" },
  { Icon: Languages, title: "land.f6.title", text: "land.f6.text" },
];

const useCases: { Icon: LucideIcon; title: Key; text: Key }[] = [
  { Icon: Briefcase, title: "land.use.1.title", text: "land.use.1.text" },
  { Icon: Users, title: "land.use.2.title", text: "land.use.2.text" },
  { Icon: Wrench, title: "land.use.3.title", text: "land.use.3.text" },
];

const faq: { q: Key; a: Key }[] = [
  { q: "land.q1", a: "land.a1" },
  { q: "land.q2", a: "land.a2" },
  { q: "land.q3", a: "land.a3" },
  { q: "land.q4", a: "land.a4" },
  { q: "land.q5", a: "land.a5" },
  { q: "land.q6", a: "land.a6" },
];

const plans: {
  id: "free" | "pro" | "business";
  name: Key;
  price: string;
  items: Key[];
}[] = [
  {
    id: "free",
    name: "plans.free",
    price: "€0",
    items: ["plans.free.f1", "plans.free.f2", "plans.free.f3", "plans.free.f4", "plans.free.f5"],
  },
  {
    id: "pro",
    name: "plans.pro",
    price: "€7.99",
    items: ["plans.pro.f1", "plans.pro.f2", "plans.pro.f3", "plans.pro.f4"],
  },
  {
    id: "business",
    name: "plans.business",
    price: "€14.99",
    items: ["plans.business.f1", "plans.business.f2", "plans.business.f3"],
  },
];

const aiActions: Key[] = ["ai.generate", "ai.improve", "ai.summarize", "ai.suggest"];

const ctaClass =
  "inline-block rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark";

function Preview() {
  const { t } = useLanguage();

  const rows = [
    { name: "Andrei Pop", note: t("land.preview.n1"), group: t("group.overdue"), bar: "border-l-overdue", tag: "bg-red-50 text-overdue" },
    { name: "Maria Ionescu", note: t("land.preview.n2"), group: t("group.today"), bar: "border-l-today", tag: "bg-amber-50 text-amber-700" },
    { name: "Elena Dumitru", note: t("land.preview.n3"), group: t("group.upcoming"), bar: "border-l-upcoming", tag: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div
      className="rounded-2xl border border-line bg-white p-4 shadow-lg"
      role="img"
      aria-label={`${t("land.preview.title")}: ${t("nav.dashboard")}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold">{t("nav.dashboard")}</p>
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
          {t("land.preview.title")}
        </span>
      </div>
      <div className="mt-4 space-y-3" aria-hidden="true">
        {rows.map((r) => (
          <div
            key={r.name}
            className={`rounded-xl border border-line border-l-4 bg-white p-3 ${r.bar}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{r.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.tag}`}>
                {r.group}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">{r.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();

  const steps = [
    { title: t("landing.s1.title"), text: t("landing.s1.text") },
    { title: t("landing.s2.title"), text: t("landing.s2.text") },
    { title: t("landing.s3.title"), text: t("landing.s3.text") },
  ];

  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex" aria-label="Main">
          <a href="#features" className="hover:text-ink">{t("land.nav.features")}</a>
          <a href="#pricing" className="hover:text-ink">{t("land.nav.pricing")}</a>
          <a href="#faq" className="hover:text-ink">{t("land.nav.faq")}</a>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-semibold text-brand">
            {t("landing.login")}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:pt-14">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("landing.title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">{t("landing.subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={ctaClass}>
              {t("landing.cta")}
            </Link>
            <a
              href="#how"
              className="rounded-xl border border-line bg-white px-6 py-3 font-semibold text-ink hover:bg-brand-soft"
            >
              {t("landing.how")}
            </a>
          </div>
          <p className="mt-3 text-sm text-slate-500">{t("land.hero.note")}</p>
        </div>
        <Preview />
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-bold tracking-tight">{t("land.problem.title")}</h2>
          <p className="mt-4 text-lg text-slate-600">{t("land.problem.text")}</p>
          <ul className="mt-6 space-y-3">
            {(["land.problem.p1", "land.problem.p2", "land.problem.p3"] as Key[]).map((k) => (
              <li key={k} className="flex gap-3 rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-overdue" aria-hidden="true" />
                {t(k)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">{t("landing.howTitle")}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-line bg-white p-6">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-4 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight">{t("land.features.title")}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-line bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 font-semibold">{t(title)}</p>
                <p className="mt-1 text-sm text-slate-600">{t(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-2xl border border-line bg-white p-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">{t("land.ai.title")}</h2>
          <p className="mt-3 text-slate-600">{t("land.ai.text")}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {aiActions.map((k) => (
              <li key={k} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">
                {t(k)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight">{t("land.use.title")}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {useCases.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-line bg-surface p-6">
                <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                <p className="mt-4 font-semibold">{t(title)}</p>
                <p className="mt-1 text-sm text-slate-600">{t(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">{t("land.pricing.title")}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`rounded-xl border bg-white p-6 ${
                p.id === "free" ? "border-brand ring-2 ring-brand/20" : "border-line"
              }`}
            >
              <h3 className="text-lg font-semibold">{t(p.name)}</h3>
              <p className="mt-3">
                <span className="text-3xl font-bold">{p.price}</span>
                {p.id !== "free" && (
                  <span className="text-sm text-slate-600"> {t("plans.perMonth")}</span>
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.items.map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
              {p.id === "free" ? (
                <Link href="/signup" className={`mt-5 block text-center ${ctaClass}`}>
                  {t("landing.cta")}
                </Link>
              ) : (
                <p className="mt-5 rounded-xl border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold text-slate-500">
                  {t("plans.comingSoon")}
                </p>
              )}
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">{t("plans.betaNote")}</p>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-done">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight">{t("land.security.title")}</h2>
          </div>
          <ul className="mt-6 space-y-3">
            {(["land.sec.1", "land.sec.2", "land.sec.3", "land.sec.4"] as Key[]).map((k) => (
              <li key={k} className="flex gap-3 text-slate-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
          <Link href="/privacy" className="mt-5 inline-block text-sm font-semibold text-brand hover:underline">
            {t("land.sec.link")}
          </Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">{t("land.faq.title")}</h2>
        <div className="mt-8 space-y-3">
          {faq.map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-line bg-white px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {t(q)}
              </summary>
              <p className="mt-3 text-sm text-slate-600">{t(a)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="rounded-2xl bg-brand px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">{t("land.final.title")}</h2>
          <p className="mt-3 text-white/90">{t("land.final.text")}</p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand hover:bg-brand-soft"
          >
            {t("landing.cta")}
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-slate-600">
          <span>
            © {new Date().getFullYear()} {BRAND}
          </span>
          <nav className="flex gap-4" aria-label="Legal">
            <Link href="/privacy" className="hover:text-ink">{t("legal.privacy")}</Link>
            <Link href="/terms" className="hover:text-ink">{t("legal.terms")}</Link>
            <Link href="/cookies" className="hover:text-ink">{t("legal.cookies")}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
