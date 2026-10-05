"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { authInput } from "@/components/auth-shell";

export default function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.ok) {
        setDone(true);
      } else if (res.status === 429) {
        setError(t("contact.err.rate"));
      } else if (res.status === 400) {
        setError(t("contact.err.invalid"));
      } else {
        setError(t("contact.err"));
      }
    } catch {
      setError(t("contact.err"));
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </div>

      <h1 className="mt-10 text-4xl font-semibold tracking-tight">{t("contact.title")}</h1>
      <p className="mt-3 text-lg text-slate-600">{t("contact.sub")}</p>

      {done ? (
        <p role="status" className="mt-8 rounded-xl bg-emerald-50 px-4 py-3 text-done">
          {t("contact.ok")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">{t("contact.name")}</label>
            <input
              id="name"
              required
              maxLength={100}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={authInput}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">{t("contact.email")}</label>
            <input
              id="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInput}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">{t("contact.message")}</label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={3000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={authInput}
            />
          </div>

          {/* Honeypot: hidden from people, tempting for bots */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">{error}</p>
          )}

          <button type="submit" disabled={busy} className="btn-brand w-full py-3">
            {busy ? t("contact.sending") : t("contact.send")}
          </button>
          <p className="text-xs text-slate-500">
            {t("contact.consent")}{" "}
            <Link href="/privacy" className="font-semibold text-brand">{t("legal.privacy")}</Link>
          </p>
        </form>
      )}
    </main>
  );
}
