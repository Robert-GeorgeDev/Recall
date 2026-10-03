"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

export default function JoinPage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [info, setInfo] = useState<{ organization_name: string; role: string } | null>(null);
  const [state, setState] = useState<"loading" | "invalid" | "ready">("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  useEffect(() => {
    if (token === null || loading || !user) return;
    if (!token) {
      setState("invalid");
      return;
    }
    supabase.rpc("preview_invitation", { invite_token: token }).then(({ data, error: failure }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (failure || !row) {
        setState("invalid");
      } else {
        setInfo(row as { organization_name: string; role: string });
        setState("ready");
      }
    });
  }, [token, loading, user]);

  async function accept() {
    if (!token) return;
    setBusy(true);
    setError("");
    const { error: failure } = await supabase.rpc("accept_invitation", { invite_token: token });
    if (failure) {
      const m = String(failure.message);
      setError(
        m.includes("already_in_workspace") ? t("join.err.inWorkspace")
        : m.includes("plan_limit_seats") ? t("join.err.seats")
        : m.includes("already_member") ? t("join.err.already")
        : m.includes("invalid_invitation") ? t("join.invalid")
        : t("common.error")
      );
      setBusy(false);
      return;
    }
    router.replace("/dashboard");
  }

  const roleLabel: Record<string, string> = {
    admin: t("team.role.admin"),
    member: t("team.role.member"),
  };

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">{t("join.title")}</h1>

        {loading || token === null ? (
          <p className="mt-4 text-slate-600">{t("common.loading")}</p>
        ) : !user ? (
          <>
            <p className="mt-4 text-slate-600">{t("join.needLogin")}</p>
            <div className="mt-5 flex gap-3">
              <Link href="/login" className="min-h-[44px] flex-1 rounded-xl bg-cta px-4 py-3 text-center text-sm font-semibold text-white hover:bg-cta-dark">
                {t("join.login")}
              </Link>
              <Link href="/signup" className="min-h-[44px] flex-1 rounded-xl border border-line px-4 py-3 text-center text-sm font-semibold">
                {t("join.signup")}
              </Link>
            </div>
          </>
        ) : state === "loading" ? (
          <p className="mt-4 text-slate-600">{t("common.loading")}</p>
        ) : state === "invalid" ? (
          <p className="mt-4 text-slate-600">{t("join.invalid")}</p>
        ) : (
          <>
            <p className="mt-4 text-slate-600">
              {t("join.invitedTo")} <strong className="text-ink">{info?.organization_name}</strong>{" "}
              {t("join.asRole")} {roleLabel[info?.role ?? "member"]}.
            </p>
            {error && <p role="alert" className="mt-3 text-sm text-overdue">{error}</p>}
            <button
              onClick={accept}
              disabled={busy}
              className="mt-5 min-h-[44px] w-full rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
            >
              {busy ? t("join.joining") : t("join.accept")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
