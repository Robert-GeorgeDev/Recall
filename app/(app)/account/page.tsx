"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

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

  return (
    <main className="mx-auto max-w-2xl px-5 pb-10 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("account.title")}</h1>

      <section className="mt-6 rounded-xl border border-line bg-white p-5">
        <p className="text-sm text-slate-600">{t("account.email")}</p>
        <p className="mt-1 break-all font-semibold">{user?.email}</p>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold">{t("account.dataTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("account.dataText")}</p>
        <Link
          href="/data"
          className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
        >
          {t("account.exportLink")}
        </Link>
      </section>

      <section className="mt-4 rounded-xl border border-red-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-overdue">
          {t("account.deleteTitle")}
        </h2>
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
          className="mt-4 rounded-xl bg-overdue px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("account.deleting") : t("account.deleteBtn")}
        </button>
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
