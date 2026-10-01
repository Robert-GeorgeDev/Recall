"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

function OnboardingForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const workspaceName = name.trim();
    if (workspaceName.length === 0 || workspaceName.length > 80) {
      setError(t("onb.invalid"));
      return;
    }

    setError("");
    setBusy(true);
    const { error: failure } = await supabase.rpc("create_workspace", {
      workspace_name: workspaceName,
    });
    if (failure) {
      setError(t("common.error"));
      setBusy(false);
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-10">
      <div className="flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>

      <h1 className="mt-10 text-3xl font-bold tracking-tight">{t("onb.title")}</h1>
      <p className="mt-2 text-slate-600">{t("onb.sub")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="workspace" className="block text-sm font-medium">
            {t("onb.label")}
          </label>
          <input
            id="workspace"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? t("auth.wait") : t("onb.continue")}
        </button>
      </form>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <RequireAuth requireWorkspace={false}>
      <OnboardingForm />
    </RequireAuth>
  );
}
