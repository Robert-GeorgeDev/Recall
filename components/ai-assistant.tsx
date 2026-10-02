"use client";

import { useState } from "react";
import { Copy, Mail, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

type Action = "generate" | "improve" | "summarize" | "suggest";

const TONES = ["professional", "friendly", "casual"] as const;
type Tone = (typeof TONES)[number];

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

const secondaryButton =
  "rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-brand-soft disabled:opacity-60";

function errorKey(code: string): Key {
  switch (code) {
    case "rate_limited":
      return "ai.err.rate";
    case "unauthorized":
      return "ai.err.unauthorized";
    case "ai_unavailable":
      return "ai.err.unavailable";
    default:
      return "common.error";
  }
}

export default function AiAssistant({
  contactId,
  email,
}: {
  contactId: string;
  email: string;
}) {
  const { t, lang } = useLanguage();
  const [tone, setTone] = useState<Tone>("professional");
  const [msgLang, setMsgLang] = useState<"en" | "ro">(lang);
  const [draft, setDraft] = useState("");
  const [output, setOutput] = useState("");
  const [lastAction, setLastAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function run(action: Action) {
    if (action === "improve" && draft.trim() === "") {
      setError(t("ai.err.noDraft"));
      return;
    }
    setError("");
    setOutput("");
    setCopied(false);
    setLoading(action);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError(t("ai.err.unauthorized"));
        setLoading(null);
        return;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          contactId,
          tone,
          lang: msgLang,
          text: action === "improve" ? draft : undefined,
        }),
      });

      const json: unknown = await res.json().catch(() => null);
      const text =
        json && typeof json === "object" && "text" in json
          ? (json as { text: unknown }).text
          : null;

      if (res.ok && typeof text === "string") {
        setOutput(text);
        setLastAction(action);
      } else {
        const code =
          json && typeof json === "object" && "error" in json
            ? String((json as { error: unknown }).error)
            : "";
        setError(t(errorKey(code)));
      }
    } catch {
      setError(t("common.error"));
    }
    setLoading(null);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("common.error"));
    }
  }

  const busy = loading !== null;
  const canEmail =
    email !== "" && (lastAction === "generate" || lastAction === "improve");

  return (
    <section className="mt-10 rounded-xl border border-line bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold">{t("ai.title")}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">{t("ai.subtitle")}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ai-tone" className="block text-xs font-medium text-slate-600">
            {t("ai.tone")}
          </label>
          <select
            id="ai-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className={inputClass}
          >
            {TONES.map((x) => (
              <option key={x} value={x}>
                {t(("ai.tone." + x) as Key)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ai-lang" className="block text-xs font-medium text-slate-600">
            {t("ai.msgLang")}
          </label>
          <select
            id="ai-lang"
            value={msgLang}
            onChange={(e) => setMsgLang(e.target.value as "en" | "ro")}
            className={inputClass}
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run("generate")}
          disabled={busy}
          className="rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {loading === "generate" ? t("ai.working") : t("ai.generate")}
        </button>
        <button
          type="button"
          onClick={() => run("summarize")}
          disabled={busy}
          className={secondaryButton}
        >
          {loading === "summarize" ? t("ai.working") : t("ai.summarize")}
        </button>
        <button
          type="button"
          onClick={() => run("suggest")}
          disabled={busy}
          className={secondaryButton}
        >
          {loading === "suggest" ? t("ai.working") : t("ai.suggest")}
        </button>
      </div>

      <div className="mt-5">
        <label htmlFor="ai-draft" className="block text-sm font-medium">
          {t("ai.draftLabel")}
        </label>
        <textarea
          id="ai-draft"
          rows={3}
          maxLength={2000}
          value={draft}
          placeholder={t("ai.draftPlaceholder")}
          onChange={(e) => setDraft(e.target.value)}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => run("improve")}
          disabled={busy}
          className={`mt-2 ${secondaryButton}`}
        >
          {loading === "improve" ? t("ai.working") : t("ai.improve")}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      {output && (
        <div className="mt-5" role="status">
          <p className="text-sm font-semibold">{t("ai.result")}</p>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm">
            {output}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? t("ai.copied") : t("ai.copy")}
            </button>
            {canEmail && (
              <a
                href={`mailto:${email}?body=${encodeURIComponent(output)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-brand-soft"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t("ai.email")}
              </a>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">{t("ai.disclaimer")}</p>
    </section>
  );
}
