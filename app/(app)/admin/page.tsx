"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RequireAuth from "@/components/require-auth";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";
import type { Key } from "@/lib/dictionaries";

type State = { enabled: boolean; updatedAt: string | null };

async function call(method: "GET" | "POST", enabled?: boolean) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { status: 403, json: null };
  const res = await fetch("/api/admin/bootstrap", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: method === "POST" ? JSON.stringify({ enabled }) : undefined,
  });
  const json = (await res.json().catch(() => null)) as State | null;
  return { status: res.status, json };
}

function ConfirmDialog({
  title,
  text,
  action,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  action: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useLanguage();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lift"
      >
        <h2 id="admin-confirm-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
          >
            {t("admin.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? t("admin.saving") : action}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminView() {
  const { t, lang } = useLanguage();
  const [state, setState] = useState<State | null>(null);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState<Key | null>(null);
  const [confirming, setConfirming] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { status, json } = await call("GET");
    if (status === 200 && json) setState(json);
    else if (status === 403) setDenied(true);
    else setError("admin.err.generic");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeDialog = useCallback(() => setConfirming(null), []);

  async function apply(enabled: boolean) {
    setBusy(true);
    setError(null);
    const { status, json } = await call("POST", enabled);
    setBusy(false);
    setConfirming(null);
    if (status === 200 && json) setState(json);
    else if (status === 403) setDenied(true);
    else setError("admin.err.generic");
  }

  if (denied) {
    return (
      <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
        <p role="alert" className="text-sm text-slate-600">
          {t("admin.err.forbidden")}
        </p>
      </main>
    );
  }

  const on = state?.enabled === true;
  const when =
    state?.updatedAt &&
    new Date(state.updatedAt).toLocaleString(lang === "ro" ? "ro-RO" : "en-GB");

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("admin.title")}</h1>

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-slate-600">{t("admin.monetization")}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{t("admin.bootstrap.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("admin.bootstrap.desc")}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={t("admin.bootstrap.switchLabel")}
            disabled={!state || busy}
            onClick={() => setConfirming(!on)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold disabled:opacity-60 ${
              on ? "border-brand bg-brand text-white" : "border-line bg-white text-slate-700"
            }`}
          >
            {on ? t("admin.bootstrap.on") : t("admin.bootstrap.off")}
          </button>
        </div>

        {state && (
          <p
            role="status"
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              on ? "bg-amber-50 text-amber-800" : "bg-brand-soft text-brand"
            }`}
          >
            {on ? t("admin.bootstrap.warnOn") : t("admin.bootstrap.infoOff")}
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">{t("admin.bootstrap.existing")}</p>
        {when && (
          <p className="mt-1 text-xs text-slate-500">
            {t("admin.bootstrap.updated").replace("{date}", when)}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {t(error)}
          </p>
        )}
      </section>

      {confirming !== null && (
        <ConfirmDialog
          title={t(confirming ? "admin.confirm.onTitle" : "admin.confirm.offTitle")}
          text={t(confirming ? "admin.confirm.onText" : "admin.confirm.offText")}
          action={t(confirming ? "admin.confirm.onButton" : "admin.confirm.offButton")}
          busy={busy}
          onCancel={closeDialog}
          onConfirm={() => apply(confirming)}
        />
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth requireWorkspace={false}>
      <AdminView />
    </RequireAuth>
  );
}
