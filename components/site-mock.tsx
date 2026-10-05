"use client";

import { useLanguage } from "@/components/language-provider";

const rows = [
  { name: "Maria Ionescu", co: "Studio Nord", note: "land.preview.n1", bar: "border-l-overdue", tag: "group.overdue", cls: "bg-red-50 text-overdue" },
  { name: "Andrei Pop", co: "Pop & Co", note: "land.preview.n2", bar: "border-l-today", tag: "group.today", cls: "bg-amber-50 text-amber-700" },
  { name: "Elena Radu", co: "Radu Design", note: "land.preview.n3", bar: "border-l-today", tag: "group.today", cls: "bg-amber-50 text-amber-700" },
] as const;

export function ProductMock() {
  const { t } = useLanguage();
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-16 max-w-5xl rounded-[1.75rem] border border-white/80 bg-white/90 text-left shadow-lift ring-1 ring-line/60 backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-slate-200" />
        <span className="h-3 w-3 rounded-full bg-slate-200" />
        <span className="h-3 w-3 rounded-full bg-slate-200" />
        <span className="ml-3 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{t("land.preview.title")}</span>
      </div>
      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_280px]">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{t("dash.morning")}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[["2", "group.overdue"], ["3", "group.today"], ["18", "dash.openLeads"]].map(([n, k]) => (
              <div key={k} className="rounded-2xl bg-slate-50 px-2 py-3 ring-1 ring-line/60">
                <p className="text-xl font-semibold">{n}</p>
                <p className="text-[11px] text-slate-600">{t(k as "group.today")}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-3">
            {rows.map((r) => (
              <li key={r.name} className={`rounded-2xl border border-line border-l-4 bg-white p-4 ${r.bar}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{r.name} <span className="font-normal text-slate-500">· {r.co}</span></p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.cls}`}>{t(r.tag)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{t(r.note)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-ink p-5 text-white shadow-soft">
          <p className="text-sm font-semibold text-indigo-300">{t("ai.title")}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{t("site.mock.draft")}</p>
          <p className="mt-4 text-xs text-slate-400">{t("ai.subtitle")}</p>
        </div>
      </div>
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
    <div aria-hidden="true" className="card rounded-3xl p-6 shadow-lift">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("land.preview.title")}</p>
      <ul className="mt-4 divide-y divide-line">
        {team.map((m) => (
          <li key={m.mail} className="flex items-center justify-between py-3 text-sm">
            <span>{m.mail}</span>
            <span className="rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-brand">{t(m.role)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
