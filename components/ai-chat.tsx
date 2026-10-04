"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, RotateCcw, Send, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

type Message = { role: "user" | "assistant"; content: string };

const TONES = ["professional", "friendly", "casual"] as const;
type Tone = (typeof TONES)[number];

const SUGGESTIONS: Key[] = ["chat.s1", "chat.s2", "chat.s3", "chat.s4"];

const selectClass =
  "rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

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

export default function AiChat() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [msgLang, setMsgLang] = useState<"en" | "ro">(lang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  async function send(raw: string) {
    const text = raw.trim();
    if (text === "" || loading) return;

    const previous = messages;
    const next: Message[] = [...previous, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessages(previous);
        setInput(text);
        setError(t("ai.err.unauthorized"));
        setLoading(false);
        return;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "chat",
          tone,
          lang: msgLang,
          messages: next.slice(-10),
        }),
      });

      const json: unknown = await res.json().catch(() => null);
      const reply =
        json && typeof json === "object" && "text" in json
          ? (json as { text: unknown }).text
          : null;

      if (res.ok && typeof reply === "string") {
        setMessages([...next, { role: "assistant", content: reply }]);
      } else {
        const code =
          json && typeof json === "object" && "error" in json
            ? String((json as { error: unknown }).error)
            : "";
        setMessages(previous);
        setInput(text);
        setError(t(errorKey(code)));
      }
    } catch {
      setMessages(previous);
      setInput(text);
      setError(t("common.error"));
    }
    setLoading(false);
  }

  async function copy(index: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError(t("common.error"));
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError("");
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("chat.title")}</h1>
            <p className="text-sm text-slate-600">{t("chat.subtitle")}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-soft"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("chat.clear")}
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t("ai.tone")}
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className={selectClass}
          >
            {TONES.map((x) => (
              <option key={x} value={x}>
                {t(("ai.tone." + x) as Key)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          {t("ai.msgLang")}
          <select
            value={msgLang}
            onChange={(e) => setMsgLang(e.target.value as "en" | "ro")}
            className={selectClass}
          >
            <option value="en">English</option>
            <option value="ro">Română</option>
          </select>
        </label>
      </div>

      <section
        className="mt-5 min-h-[320px] rounded-2xl border border-line bg-white p-4 sm:p-5"
        aria-live="polite"
        aria-label={t("chat.title")}
      >
        {messages.length === 0 && !loading ? (
          <div>
            <p className="text-sm font-semibold text-slate-700">{t("chat.tryTitle")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInput(t(key))}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-slate-700 hover:border-brand hover:bg-brand-soft"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((m, i) => (
              <li
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm sm:max-w-[85%] ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "border border-line bg-surface text-ink"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      m.role === "user" ? "text-indigo-100" : "text-slate-500"
                    }`}
                  >
                    {m.role === "user" ? t("chat.you") : t("chat.assistant")}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words">{m.content}</p>
                  {m.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => copy(i, m.content)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-brand-soft"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      {copied === i ? t("ai.copied") : t("ai.copy")}
                    </button>
                  )}
                </div>
              </li>
            ))}
            {loading && (
              <li className="flex justify-start">
                <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-slate-500">
                  {t("chat.thinking")}
                </div>
              </li>
            )}
          </ul>
        )}
        <div ref={endRef} />
      </section>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      <form
        className="mt-4 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          {t("chat.placeholder")}
        </label>
        <textarea
          id="chat-input"
          rows={2}
          maxLength={2000}
          value={input}
          placeholder={t("chat.placeholder")}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send(input);
            }
          }}
          className="min-h-[52px] flex-1 resize-y rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          disabled={loading || input.trim() === ""}
          className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {t("chat.send")}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-500">
        {t("ai.disclaimer")} {t("chat.limit")}
      </p>
    </main>
  );
}
