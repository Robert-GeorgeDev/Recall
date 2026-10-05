"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";
import EmailPrefs from "@/components/email-prefs";
import LanguageSwitcher from "@/components/language-switcher";
import { ChevronRight, Database, LayoutGrid, UserPlus } from "lucide-react";

function AccountView() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  async function handleDelete() {
    if (!canDelete) return;
    setBusy(true);
    setError("");

    const { error: failure } = await supabase.rpc("delete_my_account");
    if (failure) {
      setError(
        String(failure.message).includes("members_exist")
          ? t("account.err.members")
          : t("common.error")
      );
      setBusy(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    router.replace("/");
  }

  const label = "mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500";
  const row = "card flex min-h-[56px] items-center justify-between gap-3 px-5 py-3 transition hover:bg-slate-50";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-12 pt-8">
      <h1 className="text-4xl font-semibold tracking-tight">{t("account.title")}</h1>

      <div className="card mt-6 flex items-center gap-4 p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-lg font-semibold text-white">
          {(user?.email ?? "?").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{t("account.email")}</p>
          <p className="truncate font-semibold">{user?.email}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className={label}>{t("account.prefs")}</h2>
        <EmailPrefs />
      </section>

      <section className="mt-10">
        <h2 className={label}>{t("account.dataTitle")}</h2>
        <Link href="/data" className={row}>
          <span className="flex items-center gap-3">
            <Database className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <span>
              <span className="block font-semibold">{t("nav.data")}</span>
              <span className="block text-sm text-slate-600">{t("account.dataLead")}</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </Link>
      </section>

      <section className="mt-10 md:hidden">
        <h2 className={label}>{t("account.more")}</h2>
        <div className="space-y-2">
          <Link href="/pipeline" className={row}>
            <span className="flex items-center gap-3 font-semibold">
              <LayoutGrid className="h-5 w-5 text-slate-500" aria-hidden="true" />
              {t("nav.pipeline")}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </Link>
          <Link href="/team" className={row}>
            <span className="flex items-center gap-3 font-semibold">
              <UserPlus className="h-5 w-5 text-slate-500" aria-hidden="true" />
              {t("nav.team")}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className={label}>{t("account.lang")}</h2>
        <div className="card flex items-center justify-between px-5 py-3">
          <span className="font-semibold">{t("account.lang")}</span>
          <LanguageSwitcher />
        </div>
      </section>

      <section className="mt-10">
        <h2 className={label}>{t("account.danger")}</h2>
        <div className="rounded-2xl border border-red-200 bg-white p-5">
          <h3 className="font-semibold text-overdue">{t("account.deleteTitle")}</h3>
          <p className="mt-2 text-sm text-slate-600">{t("account.deleteText")}</p>

          <label htmlFor="confirm" className="mt-4 block text-sm font-medium">
            {t("account.confirmLabel")}
          </label>
          <input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-overdue focus:ring-2 focus:ring-overdue/20"
          />

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || busy}
            className="mt-4 rounded-xl bg-overdue px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? t("account.deleting") : t("account.deleteBtn")}
          </button>
        </div>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}
