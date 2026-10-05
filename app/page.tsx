"use client";

import Link from "next/link";
import { ArrowRight, Check, Download, Lock, Server, Trash2, type LucideIcon } from "lucide-react";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import {
  HistoryMock, ProductMock, SnoozeMock, StoryMock, TeamMock, TodayMock,
} from "@/components/site-mock";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

const demos: { n: Key; title: Key; text: Key; Mock: () => React.JSX.Element }[] = [
  { n: "site.p1.n", title: "site.p1.title", text: "site.p1.text", Mock: TodayMock },
  { n: "site.p2.n", title: "site.p2.title", text: "site.p2.text", Mock: SnoozeMock },
  { n: "site.p3.n", title: "site.p3.title", text: "site.p3.text", Mock: HistoryMock },
];

const steps: { title: Key; text: Key }[] = [
  { title: "landing.s1.title", text: "landing.s1.text" },
  { title: "landing.s2.title", text: "landing.s2.text" },
  { title: "landing.s3.title", text: "landing.s3.text" },
];

const privacy: { Icon: LucideIcon; text: Key }[] = [
  { Icon: Server, text: "land.sec.1" },
  { Icon: Download, text: "land.sec.2" },
  { Icon: Trash2, text: "land.sec.3" },
  { Icon: Lock, text: "land.sec.4" },
];

const plans: { name: Key; line: Key; price: string; feats: Key[]; live: boolean; pick: boolean }[] = [
  { name: "plans.free", line: "site.plan.free", price: "0", live: true, pick: false, feats: ["plans.free.f1", "plans.free.f2", "plans.free.f3", "plans.free.f4", "plans.free.f5"] },
  { name: "plans.pro", line: "site.plan.pro", price: "7.99", live: false, pick: true, feats: ["plans.pro.f1", "plans.pro.f2", "plans.pro.f3", "plans.pro.f4"] },
  { name: "plans.business", line: "site.plan.business", price: "14.99", live: false, pick: false, feats: ["plans.business.f1", "plans.business.f2", "plans.business.f3"] },
];

const faq: { q: Key; a: Key }[] = [
  { q: "land.q1", a: "land.a1" }, { q: "land.q2", a: "land.a2" }, { q: "land.q3", a: "land.a3" },
  { q: "land.q4", a: "land.a4" }, { q: "land.q5", a: "land.a5" }, { q: "land.q6", a: "land.a6" },
];

const btn = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold transition duration-200";

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

const h2 = "text-3xl font-semibold tracking-tight text-balance whitespace-pre-line sm:text-5xl";
const lead = "text-lg leading-relaxed text-slate-600 sm:text-xl";

export default function Home() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <div className="text-ink">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label="Octom"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex" aria-label="Main">
            <a href="#product" className="transition hover:text-ink">{t("land.nav.features")}</a>
            <a href="#pricing" className="transition hover:text-ink">{t("land.nav.pricing")}</a>
            <a href="#faq" className="transition hover:text-ink">{t("land.nav.faq")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="hidden text-sm font-medium transition hover:text-brand sm:inline">{t("landing.login")}</Link>
            <Link href="/signup" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">{t("landing.cta")}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-12 pt-20 sm:pt-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(50%_70%_at_50%_0%,rgba(99,102,241,0.10),transparent)]" />
          <div className="mx-auto max-w-6xl px-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{t("site.hero.eyebrow")}</p>
            <h1 className="mx-auto mt-5 max-w-4xl whitespace-pre-line text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">{t("landing.title")}</h1>
            <p className={`mx-auto mt-6 max-w-2xl ${lead}`}>{t("landing.subtitle")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className={`${btn} bg-brand text-white shadow-soft hover:bg-brand-dark`}>{t("landing.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href="#how" className={`${btn} border border-line bg-white text-ink hover:bg-slate-50`}>{t("landing.how")}</a>
            </div>
            <p className="mt-4 text-sm text-slate-500">{t("land.hero.note")}</p>
            <ProductMock />
          </div>
        </section>

        <Section id="story" className="text-center">
          <h2 className={`${h2} mx-auto max-w-3xl`}>{t("site.story.title")}</h2>
          <div className={`mx-auto mt-8 max-w-xl space-y-2 ${lead}`}>
            <p>{t("site.story.l1")}</p>
            <p>{t("site.story.l2")}</p>
            <p className="pt-3">{t("site.story.l3")}</p>
            <p>{t("site.story.l4")}</p>
            <p className="pt-4 font-semibold text-ink">{t("site.story.close")}</p>
          </div>
          <StoryMock />
        </Section>

        <Section id="problem" className="border-y border-line/70 bg-white/70 text-center">
          <h2 className={`${h2} mx-auto max-w-3xl`}>{t("land.problem.title")}</h2>
          <ul className={`mx-auto mt-8 max-w-xl space-y-2 ${lead}`}>
            <li>{t("land.problem.p1")}</li>
            <li>{t("land.problem.p2")}</li>
            <li>{t("land.problem.p3")}</li>
          </ul>
          <p className="mt-8 text-lg font-semibold">{t("land.problem.text")}</p>
        </Section>

        <Section id="product">
          <div className="space-y-24 sm:space-y-32">
            {demos.map(({ n, title, text, Mock }, i) => (
              <div key={n} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-sm font-semibold text-brand">{t(n)}</p>
                  <h2 className={`${h2} mt-3`}>{t(title)}</h2>
                  <p className={`mt-5 ${lead}`}>{t(text)}</p>
                </div>
                <Mock />
              </div>
            ))}
          </div>
        </Section>

        <Section id="how" className="border-y border-line/70 bg-white/70">
          <h2 className={`${h2} text-center`}>{t("landing.howTitle")}</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title}>
                <p className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</p>
                <h3 className="mt-5 text-xl font-semibold">{t(s.title)}</h3>
                <p className="mt-2 text-slate-600">{t(s.text)}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="ai">
          <div className="rounded-[1.75rem] bg-ink px-6 py-16 text-center text-white sm:px-16 sm:py-24">
            <h2 className={`${h2} mx-auto max-w-2xl`}>{t("land.ai.title")}</h2>
            <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-lg leading-relaxed text-slate-300">{t("land.ai.text")}</p>
          </div>
        </Section>

        <Section id="team" className="border-y border-line/70 bg-white/70">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className={h2}>{t("site.team.title")}</h2>
              <p className={`mt-5 ${lead}`}>{t("site.team.text")}</p>
              <ul className="mt-8 space-y-3">
                {(["site.team.p1", "site.team.p2", "site.team.p3"] as const).map((k) => (
                  <li key={k} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />{t(k)}</li>
                ))}
              </ul>
            </div>
            <TeamMock />
          </div>
        </Section>

        <Section id="privacy">
          <div className="max-w-2xl">
            <h2 className={h2}>{t("land.security.title")}</h2>
            <p className={`mt-5 ${lead}`}>{t("site.priv.lead")}</p>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {privacy.map(({ Icon, text }) => (
              <li key={text} className="flex gap-4 border-t border-line pt-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
                <span className="text-slate-800">{t(text)}</span>
              </li>
            ))}
          </ul>
          <Link href="/privacy" className="mt-8 inline-flex items-center gap-1 font-semibold text-brand hover:underline">
            {t("land.sec.link")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Section>

        <Section id="use" className="border-y border-line/70 bg-white/70 text-center">
          <h2 className={`${h2} mx-auto max-w-3xl`}>{t("land.use.title")}</h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl font-medium text-ink sm:text-2xl">{t("site.use.lead")}</p>
          <p className={`mx-auto mt-5 max-w-xl ${lead}`}>{t("site.use.text")}</p>
        </Section>

        <Section id="pricing">
          <div className="text-center">
            <h2 className={h2}>{t("land.pricing.title")}</h2>
            <p className="mt-4 text-lg text-slate-600">{t("site.pricing.sub")}</p>
            <p className="mt-5 inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600">{t("site.beta")}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`relative flex flex-col rounded-2xl p-8 ${p.pick ? "border-2 border-brand bg-white shadow-lift" : "card"}`}>
                {p.pick && (
                  <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-white">{t("site.plan.recommended")}</span>
                )}
                <h3 className="text-lg font-semibold">{t(p.name)}</h3>
                <p className="mt-1 text-sm text-slate-500">{t(p.line)}</p>
                <p className="mt-5"><span className="text-5xl font-semibold tracking-tight">€{p.price}</span> <span className="text-slate-500">{t("plans.perMonth")}</span></p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />{t(f)}</li>
                  ))}
                </ul>
                {p.live ? (
                  <Link href="/signup" className={`${btn} mt-8 bg-ink text-white hover:bg-slate-800`}>{t("landing.cta")}</Link>
                ) : (
                  <span aria-disabled="true" className={`${btn} mt-8 cursor-not-allowed bg-slate-100 text-slate-500`}>{t("plans.comingSoon")}</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">{t("plans.betaNote")}</p>
        </Section>

        <Section id="faq" className="border-t border-line/70 bg-white/70">
          <h2 className={`${h2} text-center`}>{t("land.faq.title")}</h2>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
            {faq.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                  {t(q)}
                  <span className="text-2xl text-slate-400 transition duration-200 group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-slate-600">{t(a)}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section className="bg-ink text-center text-white">
          <h2 className={`${h2} mx-auto max-w-2xl`}>{t("land.final.title")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">{t("land.final.text")}</p>
          <div className="mt-10 flex justify-center">
            <Link href="/signup" className={`${btn} bg-white text-ink hover:bg-slate-100`}>{t("landing.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
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
