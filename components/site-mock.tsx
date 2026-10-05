"use client";

import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

const rows = [
  { name: "Maria Ionescu", co: "Studio Nord", note: "land.preview.n1", bar: "border-l-overdue", tag: "group.overdue", cls: "bg-red-50 text-overdue" },
  { name: "Andrei Pop", co: "Pop & Co", note: "land.preview.n2", bar: "border-l-today", tag: "group.today", cls: "bg-amber-50 text-amber-700" },
  { name: "Elena Radu", co: "Radu Design", note: "land.preview.n3", bar: "border-l-today", tag: "group.today", cls: "bg-amber-50 text-amber-700" },
] as const;

const frame = "rounded-3xl border border-line/80 bg-white text-left shadow-lift";
const btnDone = "rounded-lg bg-done px-3 py-1.5 text-xs font-semibold text-white";
const btnGhost = "rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink";

function FollowRow({ r }: { r: (typeof rows)[number] }) {
  const { t } = useLanguage();
  return (
    <li className={`rounded-xl border border-line border-l-4 bg-white p-4 ${r.bar}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">
          {r.name} <span className="font-normal text-slate-500">· {r.co}</span>
        </p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.cls}`}>{t(r.tag)}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{t(r.note)}</p>
    </li>
  );
}

/** Hero: the Today screen, as the product shows it. */
export function ProductMock() {
  const { t } = useLanguage();
  return (
    <div aria-hidden="true" className={`mx-auto mt-16 max-w-5xl p-5 sm:p-8 ${frame}`}>
      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{t("dash.morning")}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[["2", "group.overdue", "text-overdue"], ["3", "group.today", "text-amber-700"], ["18", "dash.openLeads", "text-slate-500"]].map(([n, k, c]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-2 py-3 ring-1 ring-line/70">
                <p className={`text-xl font-semibold ${c}`}>{n}</p>
                <p className="text-[11px] text-slate-600">{t(k as "group.today")}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-3">
            {rows.map((r) => (
              <FollowRow key={r.name} r={r} />
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-ink p-5 text-white">
          <p className="text-sm font-semibold text-indigo-300">{t("ai.title")}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{t("site.mock.draft")}</p>
          <p className="mt-4 text-xs text-slate-400">{t("ai.subtitle")}</p>
        </div>
      </div>
    </div>
  );
}

/** Story section: one follow-up that has gone quiet. */
export function StoryMock() {
  const { t } = useLanguage();
  return (
    <div aria-hidden="true" className={`mx-auto mt-12 max-w-md p-6 ${frame}`}>
      <p className="text-sm text-slate-500">{t("dash.morning")}</p>
      <div className="mt-4 rounded-xl border border-line border-l-4 border-l-today bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Maria Ionescu</p>
            <p className="text-sm text-slate-500">Studio Nord</p>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {t("site.story.tag")}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-700">{t("site.story.note")}</p>
        <div className="mt-4 flex gap-2">
          <span className={btnDone}>{t("card.complete")}</span>
          <span className={btnGhost}>{t("card.snooze")}</span>
        </div>
      </div>
    </div>
  );
}

/** 01: the Today list. */
export function TodayMock() {
  return (
    <div aria-hidden="true" className={`p-5 sm:p-6 ${frame}`}>
      <ul className="space-y-3">
        {rows.map((r) => (
          <FollowRow key={r.name} r={r} />
        ))}
      </ul>
    </div>
  );
}

/** 02: snooze options. */
export function SnoozeMock() {
  const { t } = useLanguage();
  return (
    <div aria-hidden="true" className={`p-5 sm:p-6 ${frame}`}>
      <div className="rounded-xl border border-line border-l-4 border-l-overdue bg-white p-4">
        <p className="font-semibold">Maria Ionescu</p>
        <p className="text-sm text-slate-500">Studio Nord</p>
        <p className="mt-2 text-sm text-slate-700">{t("land.preview.n1")}</p>
      </div>
      <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-line/70">
        <div className="flex flex-wrap gap-2">
          <span className={btnGhost}>{t("card.tomorrow")}</span>
          <span className="rounded-lg border border-brand bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
            {t("card.nextWeek")}
          </span>
          <span className={btnGhost}>{t("card.pickDate")}</span>
        </div>
      </div>
    </div>
  );
}

const history: Key[] = ["site.hist.1", "site.hist.2", "site.hist.3"];

/** 03: contact history. */
export function HistoryMock() {
  const { t } = useLanguage();
  return (
    <div aria-hidden="true" className={`p-5 sm:p-6 ${frame}`}>
      <p className="font-semibold">Maria Ionescu</p>
      <p className="text-sm text-slate-500">Studio Nord</p>
      <ol className="mt-5 space-y-4 border-l border-line pl-5">
        {history.map((k, i) => (
          <li key={k} className="relative text-sm text-slate-700">
            <span className={`absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-brand" : "bg-slate-300"}`} />
            {t(k)}
          </li>
        ))}
      </ol>
    </div>
  );
}

const team = [
  { mail: "ana@example.com", role: "team.role.owner" },
  { mail: "radu@example.com", role: "team.role.admin" },
  { mail: "ioana@example.com", role: "team.role.member" },
] as const;

export function TeamMock() {
  const { t } = useLanguage();
  return (
    <div aria-hidden="true" className={`p-6 ${frame}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("land.preview.title")}</p>
      <ul className="mt-4 divide-y divide-line">
        {team.map((m) => (
          <li key={m.mail} className="flex items-center justify-between py-3 text-sm">
            <span>{m.mail}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{t(m.role)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
