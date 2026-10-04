"use client";

import Link from "next/link";
import {
  ArrowRight, CalendarCheck, Check, Download, FileSpreadsheet, Globe, History,
  Lock, Server, ShieldCheck, Sparkles, Users, type LucideIcon,
} from "lucide-react";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { ProductMock, TeamMock } from "@/components/site-mock";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

const features: { Icon: LucideIcon; title: Key; text: Key }[] = [
  { Icon: CalendarCheck, title: "land.f1.title", text: "land.f1.text" },
  { Icon: Check, title: "land.f2.title", text: "land.f2.text" },
  { Icon: Users, title: "land.f3.title", text: "land.f3.text" },
  { Icon: History, title: "land.f4.title", text: "land.f4.text" },
  { Icon: FileSpreadsheet, title: "land.f5.title", text: "land.f5.text" },
  { Icon: Globe, title: "land.f6.title", text: "land.f6.text" },
];

const steps: { title: Key; text: Key }[] = [
  { title: "landing.s1.title", text: "landing.s1.text" },
  { title: "landing.s2.title", text: "landing.s2.text" },
  { title: "landing.s3.title", text: "landing.s3.text" },
];

const security: { Icon: LucideIcon; text: Key }[] = [
  { Icon: ShieldCheck, text: "land.sec.1" },
  { Icon: Server, text: "land.sec.2" },
  { Icon: Download, text: "land.sec.3" },
  { Icon: Lock, text: "land.sec.4" },
];

const uses: { title: Key; text: Key }[] = [
  { title: "land.use.1.title", text: "land.use.1.text" },
  { title: "land.use.2.title", text: "land.use.2.text" },
  { title: "land.use.3.title", text: "land.use.3.text" },
];

const plans: { name: Key; price: string; feats: Key[]; live: boolean; ring: boolean }[] = [
  { name: "plans.free", price: "0", live: true, ring: false, feats: ["plans.free.f1", "plans.free.f2", "plans.free.f3", "plans.free.f4", "plans.free.f5"] },
  { name: "plans.pro", price: "7.99", live: false, ring: true, feats: ["plans.pro.f1", "plans.pro.f2", "plans.pro.f3", "plans.pro.f4"] },
  { name: "plans.business", price: "14.99", live: false, ring: false, feats: ["plans.business.f1", "plans.business.f2", "plans.business.f3"] },
];

const faq: { q: Key; a: Key }[] = [
  { q: "land.q1", a: "land.a1" }, { q: "land.q2", a: "land.a2" }, { q: "land.q3", a: "land.a3" },
  { q: "land.q4", a: "land.a4" }, { q: "land.q5", a: "land.a5" }, { q: "land.q6", a: "land.a6" },
];

const btn = "inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-base font-medium";

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

const h2 = "text-3xl font-semibold tracking-tight sm:text-5xl";

export default function Home() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <div className="bg-white text-ink">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label="Octom"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex" aria-label="Main">
            <a href="#product" className="hover:text-ink">{t("land.nav.features")}</a>
            <a href="#team" className="hover:text-ink">{t("site.nav.team")}</a>
            <a href="#pricing" className="hover:text-ink">{t("land.nav.pricing")}</a>
            <a href="#faq" className="hover:text-ink">{t("land.nav.faq")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-sm font-medium sm:inline">{t("landing.login")}</Link>
            <Link href="/signup" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">{t("landing.cta")}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[radial-gradient(60%_45%_at_50%_0%,#EEF2FF_0%,rgba(255,255,255,0)_70%)] pb-8 pt-20 sm:pt-28">
          <div className="mx-auto max-w-6xl px-5 text-center">
            <p className="text-sm font-medium text-brand">{t("site.hero.eyebrow")}</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{t("landing.title")}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">{t("landing.subtitle")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className={`${btn} bg-brand text-white hover:bg-brand-dark`}>{t("landing.cta")}</Link>
              <Link href="/login" className={`${btn} border border-line text-ink hover:bg-slate-50`}>{t("site.cta.portal")}</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">{t("land.hero.note")}</p>
            <ProductMock />
          </div>
        </section>

        <Section id="problem" className="text-center">
          <h2 className={`${h2} mx-auto max-w-3xl`}>{t("land.problem.title")}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{t("land.problem.text")}</p>
        </Section>

        <Section id="product" className="bg-slate-50">
          <div className="max-w-2xl">
            <h2 className={h2}>{t("site.product.title")}</h2>
            <p className="mt-4 text-lg text-slate-600">{t("site.product.text")}</p>
          </div>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, text }) => (
              <div key={title}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand shadow-sm"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-semibold">{t(title)}</h3>
                <p className="mt-2 text-slate-600">{t(text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="how">
          <h2 className={`${h2} text-center`}>{t("landing.howTitle")}</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title}>
                <p className="text-6xl font-semibold text-slate-200">{i + 1}</p>
                <h3 className="mt-3 text-xl font-semibold">{t(s.title)}</h3>
                <p className="mt-2 text-slate-600">{t(s.text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="ai">
          <div className="rounded-[2rem] bg-ink px-6 py-16 text-center text-white sm:px-16 sm:py-24">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-300" aria-hidden="true" />
            <h2 className={`${h2} mx-auto mt-6 max-w-2xl`}>{t("land.ai.title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{t("land.ai.text")}</p>
          </div>
        </Section>

        <Section id="team" className="bg-slate-50">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className={h2}>{t("site.team.title")}</h2>
              <p className="mt-4 text-lg text-slate-600">{t("site.team.text")}</p>
              <ul className="mt-8 space-y-3">
                {(["site.team.p1", "site.team.p2", "site.team.p3"] as const).map((k) => (
                  <li key={k} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />{t(k)}</li>
                ))}
              </ul>
            </div>
            <TeamMock />
          </div>
        </Section>

        <Section id="use">
          <h2 className={`${h2} max-w-2xl`}>{t("land.use.title")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {uses.map((u) => (
              <div key={u.title} className="rounded-3xl border border-line p-8">
                <h3 className="text-xl font-semibold">{t(u.title)}</h3>
                <p className="mt-3 text-slate-600">{t(u.text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-lavender text-center">
          <h2 className={`${h2} mx-auto max-w-2xl`}>{t("site.time.title")}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{t("site.time.text")}</p>
        </Section>

        <Section id="security">
          <h2 className={h2}>{t("land.security.title")}</h2>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {security.map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
                <span className="text-slate-700">{t(text)}</span>
              </li>
            ))}
          </ul>
          <Link href="/privacy" className="mt-8 inline-flex items-center gap-1 font-medium text-brand">
            {t("land.sec.link")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Section>

        <Section id="pricing" className="bg-slate-50">
          <div className="text-center">
            <h2 className={h2}>{t("land.pricing.title")}</h2>
            <p className="mt-4 text-lg text-slate-600">{t("site.pricing.sub")}</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-3xl bg-white p-8 ${p.ring ? "ring-2 ring-brand" : "border border-line"}`}>
                <h3 className="text-lg font-semibold">{t(p.name)}</h3>
                <p className="mt-4"><span className="text-5xl font-semibold tracking-tight">€{p.price}</span> <span className="text-slate-500">{t("plans.perMonth")}</span></p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{t(f)}</li>
                  ))}
                </ul>
                {p.live ? (
                  <Link href="/signup" className={`${btn} mt-8 bg-brand text-white hover:bg-brand-dark`}>{t("landing.cta")}</Link>
                ) : (
                  <span aria-disabled="true" className={`${btn} mt-8 cursor-not-allowed bg-slate-100 text-slate-500`}>{t("plans.comingSoon")}</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">{t("plans.betaNote")}</p>
        </Section>

        <Section id="faq">
          <h2 className={`${h2} text-center`}>{t("land.faq.title")}</h2>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
            {faq.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                  {t(q)}
                  <span className="text-2xl text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-slate-600">{t(a)}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section className="bg-ink text-center text-white">
          <h2 className={`${h2} mx-auto max-w-2xl`}>{t("land.final.title")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">{t("land.final.text")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className={`${btn} bg-white text-ink hover:bg-slate-100`}>{t("landing.cta")}</Link>
            <Link href="/login" className={`${btn} border border-white/30 text-white hover:bg-white/10`}>{t("site.cta.portal")}</Link>
          </div>
        </Section>
      </main>

      <footer className="border-t border-line py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-slate-500">© {year} Octom. {t("site.footer.rights")}</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div className="space-y-3">
              <p className="font-semibold">{t("site.footer.product")}</p>
              <a href="#product" className="block text-slate-600 hover:text-ink">{t("land.nav.features")}</a>
              <a href="#pricing" className="block text-slate-600 hover:text-ink">{t("land.nav.pricing")}</a>
              <a href="#faq" className="block text-slate-600 hover:text-ink">{t("land.nav.faq")}</a>
            </div>
            <div className="space-y-3">
              <p className="font-semibold">{t("site.footer.legal")}</p>
              <Link href="/privacy" className="block text-slate-600 hover:text-ink">Privacy</Link>
              <Link href="/terms" className="block text-slate-600 hover:text-ink">Terms</Link>
              <Link href="/cookies" className="block text-slate-600 hover:text-ink">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
