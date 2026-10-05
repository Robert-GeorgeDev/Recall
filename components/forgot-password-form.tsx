"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell, { authInput } from "@/components/auth-shell";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: failure } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (
        failure?.code === "over_email_send_rate_limit" ||
        failure?.code === "over_request_rate_limit"
      ) {
        setError(t("auth.err.rate"));
      } else {
        // Same answer whether or not the account exists, so nobody can probe for emails.
        setSent(true);
      }
    } catch {
      setError(t("common.error"));
    }
    setBusy(false);
  }

  return (
    <AuthShell>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight">{t("forgot.title")}</h1>
      <p className="mt-2 text-slate-600">{t("forgot.sub")}</p>

      {sent ? (
        <p role="status" className="mt-8 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
          {t("forgot.sent")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInput}
            />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-brand w-full py-3">
            {busy ? t("auth.wait") : t("forgot.btn")}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm">
        <Link href="/login" className="font-semibold text-brand">
          {t("forgot.back")}
        </Link>
      </p>
    </AuthShell>
  );
}
