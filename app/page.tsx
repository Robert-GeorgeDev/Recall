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

const btn = "inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-base font-medium transition";

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

const h2 = "text-3xl font-semibold tracking-tight text-balance sm:text-5xl";

export default function Home() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <div className="text-ink">
      <header className="sticky top-0 z-40 border-b border-line/50 bg-white/70 backdrop-blur-xl">
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
            <Link href="/signup" className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">{t("landing.cta")}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-12 pt-20 sm:pt-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(45%_60%_at_20%_0%,rgba(99,102,241,0.18),transparent),radial-gradient(40%_55%_at_80%_5%,rgba(56,189,248,0.18),transparent),radial-gradient(40%_50%_at_55%_30%,rgba(251,191,136,0.16),transparent)]" />
          <div className="mx-auto max-w-6xl px-5 text-center">
            <p className="mx-auto inline-flex rounded-full border border-brand/20 bg-white/80 px-4 py-1.5 text-sm font-medium text-brand shadow-soft">{t("site.hero.eyebrow")}</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{t("landing.title")}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">{t("landing.subtitle")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className={`${btn} bg-ink text-white shadow-lift hover:bg-slate-800`}>{t("landing.cta")}</Link>
              <Link href="/login" className={`${btn} border border-line bg-white/80 text-ink hover:bg-white`}>{t("site.cta.portal")}</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">{t("land.hero.note")}</p>
            <ProductMock />
          </div>
        </section>

        <Section id="problem" className="text-center">
          <h2 className={`${h2} mx-auto max-w-3xl`}>{t("land.problem.title")}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{t("land.problem.text")}</p>
        </Section>

        <Section id="product" className="bg-white/60">
          <div className="max-w-2xl">
            <h2 className={h2}>{t("site.product.title")}</h2>
            <p className="mt-4 text-lg text-slate-600">{t("site.product.text")}</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, text }) => (
              <div key={title} className="card p-7 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <h3 className="mt-6 text-lg font-semibold">{t(title)}</h3>
                <p className="mt-2 text-slate-600">{t(text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="how">
          <h2 className={`${h2} text-center`}>{t("landing.howTitle")}</h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-8">
                <p className="grid h-12 w-12 place-items-center rounded-full bg-ink text-lg font-semibold text-white">{i + 1}</p>
                <h3 className="mt-6 text-xl font-semibold">{t(s.title)}</h3>
                <p className="mt-2 text-slate-600">{t(s.text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="ai">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white shadow-lift sm:px-16 sm:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand/40 blur-3xl" />
            <Sparkles className="relative mx-auto h-8 w-8 text-indigo-300" aria-hidden="true" />
            <h2 className={`${h2} mx-auto mt-6 max-w-2xl`}>{t("land.ai.title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{t("land.ai.text")}</p>
          </div>
        </Section>

        <Section id="team" className="bg-white/60">
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
              <div key={u.title} className="card p-8">
                <h3 className="text-xl font-semibold">{t(u.title)}</h3>
                <p className="mt-3 text-slate-600">{t(u.text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-lavender to-white/0 text-center">
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

        <Section id="pricing" className="bg-white/60">
          <div className="text-center">
            <h2 className={h2}>{t("land.pricing.title")}</h2>
            <p className="mt-4 text-lg text-slate-600">{t("site.pricing.sub")}</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-3xl p-8 ${p.ring ? "bg-ink text-white shadow-lift" : "card"}`}>
                <h3 className="text-lg font-semibold">{t(p.name)}</h3>
                <p className="mt-4"><span className="text-5xl font-semibold tracking-tight">€{p.price}</span> <span className={p.ring ? "text-slate-400" : "text-slate-500"}>{t("plans.perMonth")}</span></p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-3"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.ring ? "text-indigo-300" : "text-brand"}`} aria-hidden="true" />{t(f)}</li>
                  ))}
                </ul>
                {p.live ? (
                  <Link href="/signup" className={`${btn} mt-8 bg-ink text-white hover:bg-slate-800`}>{t("landing.cta")}</Link>
                ) : (
                  <span aria-disabled="true" className={`${btn} mt-8 cursor-not-allowed ${p.ring ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-500"}`}>{t("plans.comingSoon")}</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">{t("plans.betaNote")}</p>
        </Section>

        <Section id="faq">
          <h2 className={`${h2} text-center`}>{t("land.faq.title")}</h2>
          <div className="card mx-auto mt-12 max-w-3xl divide-y divide-line/70 px-6">
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
