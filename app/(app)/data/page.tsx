"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Upload } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { FREE_LIMITS, usePlan } from "@/hooks/use-plan";
import { supabase } from "@/lib/supabase";
import { addDays, todayISO } from "@/lib/dates";
import { BRAND } from "@/lib/brand";
import {
  buildCsv,
  downloadCsv,
  MAX_FILE_BYTES,
  parseContactsCsv,
  type ImportRow,
  type RowIssue,
} from "@/lib/csv";
import type { Key } from "@/lib/dictionaries";

type Parsed = { rows: ImportRow[]; issues: RowIssue[]; badRows: number };
type ImportResult = { imported: number; followUps: number; failed: boolean };

type ContactRow = {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
};

type FollowUpRow = { contact_id: string; due_date: string };

const buttonClass =
  "inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-brand-soft focus-within:ring-2 focus-within:ring-brand-accent";

async function fetchPages<T>(
  build: (
    from: number,
    to: number
  ) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  const all: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw error;
    const page = data ?? [];
    all.push(...page);
    if (page.length < 1000) break;
  }
  return all;
}

function DataView() {
  const { t } = useLanguage();
  const orgId = useOrgId();
  const { state: planState, reload: reloadPlan } = usePlan(orgId);

  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [fileError, setFileError] = useState<Key | "">("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  function reset() {
    setParsed(null);
    setFileError("");
    setResult(null);
    setProgress(0);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    reset();

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("data.err.fileType");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError("data.err.fileSize");
      return;
    }

    try {
      const text = await file.text();
      const res = parseContactsCsv(text);
      if (!res.ok) {
        setFileError(("data.err." + res.error) as Key);
        return;
      }
      setParsed({ rows: res.rows, issues: res.issues, badRows: res.badRows });
    } catch {
      setFileError("data.err.read");
    }
  }

  function downloadTemplate() {
    const next = addDays(todayISO(), 7);
    downloadCsv(
      `${BRAND.toLowerCase()}-contacts-template.csv`,
      buildCsv([
        ["Maria", "Ionescu", "Bright Agency", "maria@example.com", "+40 700 000 000", "Contacted", "Asked for a call this week", next],
        ["Andrei", "Pop", "Studio Nord", "andrei@example.com", "", "New", "", ""],
      ])
    );
  }

  async function runImport() {
    if (!orgId || !parsed || parsed.rows.length === 0) return;
    setImporting(true);
    setProgress(0);

    let imported = 0;
    let followUps = 0;
    let failed = false;

    try {
      for (let i = 0; i < parsed.rows.length; i += 100) {
        const chunk = parsed.rows.slice(i, i + 100).map((r) => ({
          id: crypto.randomUUID(),
          r,
        }));

        const { error: contactError } = await supabase.from("contacts").insert(
          chunk.map(({ id, r }) => ({
            id,
            organization_id: orgId,
            ...r.contact,
          }))
        );
        if (contactError) throw contactError;
        imported += chunk.length;
        setProgress(imported);

        const dated = chunk
          .filter(({ r }) => r.nextFollowup)
          .map(({ id, r }) => ({
            organization_id: orgId,
            contact_id: id,
            due_date: r.nextFollowup,
            note: "",
          }));
        if (dated.length > 0) {
          const { error: followUpError } = await supabase
            .from("follow_ups")
            .insert(dated);
          if (followUpError) throw followUpError;
          followUps += dated.length;
        }
      }
    } catch {
      failed = true;
    }

    setResult({ imported, followUps, failed });
    reloadPlan();
    setImporting(false);
  }

  async function handleExport() {
    if (!orgId) return;
    setExporting(true);
    setExportFailed(false);
    try {
      const contacts = await fetchPages<ContactRow>((from, to) =>
        supabase
          .from("contacts")
          .select("id, first_name, last_name, company, email, phone, status, notes")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(from, to)
      );

      const followUps = await fetchPages<FollowUpRow>((from, to) =>
        supabase
          .from("follow_ups")
          .select("contact_id, due_date")
          .eq("organization_id", orgId)
          .eq("status", "open")
          .order("due_date", { ascending: true })
          .order("id", { ascending: true })
          .range(from, to)
      );

      const next = new Map<string, string>();
      for (const f of followUps) {
        if (!next.has(f.contact_id)) next.set(f.contact_id, f.due_date);
      }

      downloadCsv(
        `${BRAND.toLowerCase()}-contacts-${todayISO()}.csv`,
        buildCsv(
          contacts.map((c) => [
            c.first_name,
            c.last_name,
            c.company,
            c.email,
            c.phone,
            c.status,
            c.notes,
            next.get(c.id) ?? "",
          ])
        )
      );
    } catch {
      setExportFailed(true);
    }
    setExporting(false);
  }

  function issueText(i: RowIssue): string {
    if (i.code === "too_long") {
      return `${i.field ?? ""} ${t("data.rowerr.too_long")}`;
    }
    return t(("data.rowerr." + i.code) as Key);
  }

  const showPreview = parsed !== null && result === null;

  const contactsLeft =
    planState && planState.plan === "free"
      ? Math.max(0, FREE_LIMITS.contacts - planState.contacts)
      : null;
  const followUpsLeft =
    planState && planState.plan === "free"
      ? Math.max(0, FREE_LIMITS.followUps - planState.followUps)
      : null;
  const datedRows = parsed ? parsed.rows.filter((r) => r.nextFollowup).length : 0;
  const overLimit =
    parsed !== null &&
    ((contactsLeft !== null && parsed.rows.length > contactsLeft) ||
      (followUpsLeft !== null && datedRows > followUpsLeft));

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("data.title")}</h1>

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold">{t("data.importTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("data.importHelp")}</p>
        <p className="mt-2 text-xs text-slate-500">{t("data.columns")}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={downloadTemplate} className={buttonClass}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("data.downloadTemplate")}
          </button>
          <label className={`${buttonClass} cursor-pointer`}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            {t("data.chooseFile")}
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="sr-only"
            />
          </label>
        </div>

        {fileError && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {t(fileError)}
          </p>
        )}

        {showPreview && parsed && (
          <div className="mt-6">
            <h3 className="font-semibold">{t("data.preview")}</h3>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-2xl font-bold text-done">{parsed.rows.length}</p>
                <p className="text-xs text-slate-600">{t("data.ready")}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-2xl font-bold text-overdue">{parsed.badRows}</p>
                <p className="text-xs text-slate-600">{t("data.skipped")}</p>
              </div>
            </div>

            {parsed.rows.length > 0 && (
              <>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs text-slate-500">
                        <th className="py-2 pr-3 font-semibold">{t("data.colName")}</th>
                        <th className="py-2 pr-3 font-semibold">{t("data.colCompany")}</th>
                        <th className="py-2 pr-3 font-semibold">{t("data.colEmail")}</th>
                        <th className="py-2 pr-3 font-semibold">{t("data.colStatus")}</th>
                        <th className="py-2 font-semibold">{t("data.colFollowUp")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.rows.slice(0, 10).map((r) => (
                        <tr key={r.row} className="border-b border-line last:border-0">
                          <td className="py-2 pr-3">
                            {`${r.contact.first_name} ${r.contact.last_name}`.trim()}
                          </td>
                          <td className="py-2 pr-3">{r.contact.company}</td>
                          <td className="py-2 pr-3">{r.contact.email}</td>
                          <td className="py-2 pr-3">
                            {t(("status." + r.contact.status) as Key)}
                          </td>
                          <td className="py-2">{r.nextFollowup ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsed.rows.length > 10 && (
                  <p className="mt-2 text-xs text-slate-500">{t("data.showingFirst")}</p>
                )}
              </>
            )}

            {parsed.issues.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-overdue">
                  {t("data.errorsTitle")}
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {parsed.issues.slice(0, 20).map((i, idx) => (
                    <li key={idx}>
                      {t("data.row")} {i.row}: {issueText(i)}
                    </li>
                  ))}
                </ul>
                {parsed.issues.length > 20 && (
                  <p className="mt-2 text-xs text-slate-500">
                    + {parsed.issues.length - 20} {t("data.moreErrors")}
                  </p>
                )}
              </div>
            )}

            {overLimit && (
              <p role="alert" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {t("plan.limitImport")
                  .replace("{c}", String(contactsLeft ?? 0))
                  .replace("{f}", String(followUpsLeft ?? 0))}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={runImport}
                disabled={importing || parsed.rows.length === 0 || !orgId || overLimit}
                className="rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
              >
                {importing
                  ? `${t("data.importing")} ${progress} / ${parsed.rows.length}`
                  : `${t("data.importBtn")} (${parsed.rows.length})`}
              </button>
              {!importing && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-semibold text-slate-600 hover:text-ink"
                >
                  {t("data.cancel")}
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6" role="status">
            <h3 className="font-semibold">{t("data.done")}</h3>
            <p className="mt-2 text-sm">
              {t("data.importedCount")}: <strong>{result.imported}</strong>
            </p>
            <p className="text-sm">
              {t("data.followUpsCount")}: <strong>{result.followUps}</strong>
            </p>
            {result.failed && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
                {t("data.partial")}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contacts"
                className="rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
              >
                {t("data.viewContacts")}
              </Link>
              <button
                type="button"
                onClick={reset}
                className="text-sm font-semibold text-slate-600 hover:text-ink"
              >
                {t("data.importAnother")}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold">{t("data.exportTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("data.exportHelp")}</p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || !orgId}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {exporting ? t("data.exporting") : t("data.exportBtn")}
        </button>
        {exportFailed && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {t("data.exportError")}
          </p>
        )}
      </section>
    </main>
  );
}

export default function DataPage() {
  return (
    <RequireAuth>
      <DataView />
    </RequireAuth>
  );
}
