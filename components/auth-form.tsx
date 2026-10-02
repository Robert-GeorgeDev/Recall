"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

function errorKey(code: string | undefined): Key {
  switch (code) {
    case "user_already_exists":
      return "auth.err.exists";
    case "validation_failed":
    case "email_address_invalid":
      return "auth.err.email";
    case "weak_password":
      return "auth.err.weak";
    case "invalid_credentials":
      return "auth.err.credentials";
    case "email_not_confirmed":
      return "auth.err.notConfirmed";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "auth.err.rate";
    default:
      return "common.error";
  }
}

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const result = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(t(errorKey(result.error.code)));
        setBusy(false);
        return;
      }

      if (isSignup && !result.data.session) {
        setInfo(t("auth.checkEmail"));
        setBusy(false);
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError(t("common.error"));
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </div>

      <h1 className="mt-10 text-3xl font-bold tracking-tight">
        {isSignup ? t("auth.createTitle") : t("auth.welcomeBack")}
      </h1>
      <p className="mt-2 text-slate-600">
        {isSignup ? t("auth.createSub") : t("auth.loginSub")}
      </p>

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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {isSignup && (
            <p className="mt-1 text-xs text-slate-500">{t("auth.min8")}</p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy
            ? t("auth.wait")
            : isSignup
            ? t("auth.createBtn")
            : t("auth.loginBtn")}
        </button>
      </form>

      {isSignup && (
        <p className="mt-4 text-xs text-slate-500">
          {t("legal.agree")}{" "}
          <Link href="/terms" className="font-semibold text-brand">
            {t("legal.terms")}
          </Link>{" "}
          {t("legal.and")}{" "}
          <Link href="/privacy" className="font-semibold text-brand">
            {t("legal.privacy")}
          </Link>
          .
        </p>
      )}

      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? t("auth.haveAccount") : t("auth.newHere")}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-brand"
        >
          {isSignup ? t("auth.loginBtn") : t("auth.createLink")}
        </Link>
      </p>
    </main>
  );
}
