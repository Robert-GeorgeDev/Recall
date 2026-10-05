"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const delay = (value: string) => ({ "--d": value }) as React.CSSProperties;

/**
 * Home page hero: one idea ("You said you'd follow up. Octom remembers.")
 * and one piece of product artwork. Everything inside the artwork is
 * decorative, fictional demo data.
 */
export default function Hero() {
  const { t } = useLanguage();
  const [first, second] = t("landing.title").split("\n");

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div aria-hidden="true" className="hero-bg pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-5 text-center">
        <p
          className="hero-in inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
          style={delay("0s")}
        >
          <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-brand sm:inline-block" aria-hidden="true" />
          {t("site.hero.eyebrow")}
        </p>

        <h1
          className="hero-in mx-auto mt-6 max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-7xl lg:text-[5.5rem]"
          style={delay("0.08s")}
        >
          <span className="block text-slate-400">{first}</span>
          <span className="block">{second}</span>
        </h1>

        <p
          className="hero-in mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-slate-600 sm:text-lg"
          style={delay("0.16s")}
        >
          {t("landing.subtitle")}
        </p>

        <div
          className="hero-in mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6"
          style={delay("0.24s")}
        >
          <Link
            href="/signup"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-brand px-8 text-base font-semibold text-white shadow-soft transition duration-200 hover:bg-brand-dark"
          >
            {t("landing.cta")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <a
            href="#how"
            className="inline-flex min-h-[44px] items-center px-2 text-base font-medium text-slate-600 underline-offset-4 transition hover:text-ink hover:underline"
          >
            {t("landing.how")}
          </a>
        </div>
        <p
          className="hero-in mt-4 text-sm text-slate-500"
          style={delay("0.3s")}
        >
          {t("land.hero.note")}
        </p>

        <div
          aria-hidden="true"
          className="hero-in relative mx-auto mt-14 w-full max-w-[640px] text-left sm:mt-16"
          style={delay("0.42s")}
        >
          {/* Main product card */}
          <div className="rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-7">
            <p className="text-sm text-slate-500">{t("dash.morning")}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("site.hero.count")}
            </p>

            <ul className="mt-5 space-y-3">
              <li className="hero-focus relative flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-today" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Maria Ionescu <span className="font-normal text-slate-500">· Studio Nord</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{t("site.story.note")}</p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {t("site.story.tag")}
                </span>

                {/* Context chip: how long ago, moving toward today */}
                <div className="absolute right-full top-1/2 hidden -translate-y-1/2 xl:block">
                  <div className="relative mr-8 w-44 rounded-2xl border border-line bg-white p-3 shadow-soft">
                    <p className="text-xs font-semibold text-slate-700">{t("site.hero.ago")}</p>
                    <div className="relative mt-3 h-1 rounded-full bg-slate-200">
                      <span className="hero-dot absolute -top-1 h-3 w-3 rounded-full bg-brand" />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                      <span>{t("site.hero.from")}</span>
                      <span className="font-semibold text-amber-800">{t("group.today")}</span>
                    </div>
                    <span className="absolute left-full top-1/2 w-8 border-t border-dashed border-slate-300" />
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-today" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    Andrei Pop <span className="font-normal text-slate-500">· Pop &amp; Co</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{t("site.hero.n2")}</p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {t("group.today")}
                </span>
              </li>

              <li className="flex items-start gap-3 rounded-2xl border border-line bg-slate-50/60 p-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-700">
                    Elena Radu <span className="font-normal text-slate-500">· Radu Design</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">{t("land.preview.n3")}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-done">
                  {t("site.hero.done")}
                </span>
              </li>
            </ul>
          </div>

          {/* Draft card: floats at the side on large screens, sits below on small ones */}
          <div className="hero-float mt-3 rounded-2xl border border-line bg-white p-4 shadow-lift xl:absolute xl:-right-56 xl:top-[250px] xl:mt-0 xl:w-60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
              {t("site.story.tag")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{t("site.hero.draft")}</p>
            <p className="mt-3 text-sm font-semibold text-brand">{t("site.hero.viewDraft")}</p>
          </div>

          {/* Success indicator, large screens only */}
          <div className="absolute -bottom-5 -left-12 hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-soft xl:flex">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-done">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            {t("site.hero.resolved")}
          </div>
        </div>
      </div>
    </section>
  );
}
