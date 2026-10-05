"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { authInput } from "@/components/auth-shell";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

type State = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The link in the email signs the visitor in briefly; wait for that session.
  useEffect(() => {
    let settled = false;
    const settle = (next: State) => {
      settled = true;
      setState((current) => (current === "done" ? current : next));
    };
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) settle("ready");
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session) settle("ready");
    });
    const timer = setTimeout(() => {
      if (!settled) settle("invalid");
    }, 5000);
    return () => {
      clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== repeat) {
      setError(t("reset.mismatch"));
      return;
    }
    setBusy(true);
    try {
      const { error: failure } = await supabase.auth.updateUser({ password });
      if (failure) {
        setError(failure.code === "weak_password" ? t("auth.err.weak") : t("common.error"));
        setBusy(false);
        return;
      }
      setState("done");
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch {
      setError(t("common.error"));
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="mt-10 text-3xl font-semibold tracking-tight">{t("reset.title")}</h1>

      {state === "checking" && <p className="mt-4 text-slate-600">{t("reset.checking")}</p>}

      {state === "invalid" && (
        <>
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {t("reset.invalid")}
          </p>
          <Link href="/forgot-password" className="btn-brand mt-6 w-full py-3">
            {t("reset.invalidBtn")}
          </Link>
        </>
      )}

      {state === "done" && (
        <p role="status" className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-done">
          {t("reset.done")}
        </p>
      )}

      {state === "ready" && (
        <>
          <p className="mt-2 text-slate-600">{t("reset.sub")}</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t("reset.new")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInput}
              />
            </div>
            <div>
              <label htmlFor="repeat" className="block text-sm font-medium">
                {t("reset.confirm")}
              </label>
              <input
                id="repeat"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className={authInput}
              />
            </div>
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-brand w-full py-3">
              {busy ? t("auth.wait") : t("reset.btn")}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
