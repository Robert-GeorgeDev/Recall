"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useLanguage } from "@/components/language-provider";

const KEY = "octom-consent";
const OPEN_EVENT = "octom:consent-open";

type Choice = "granted" | "denied" | null;

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Lets any link (e.g. the footer) reopen the consent banner. */
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsButton({ className }: { className?: string }) {
  const { lang } = useLanguage();
  return (
    <button type="button" onClick={openConsent} className={className}>
      {lang === "ro" ? "Setări cookie" : "Cookie settings"}
    </button>
  );
}

/**
 * Consent banner + Vercel Web Analytics. The analytics script is only loaded
 * after the visitor explicitly accepts; the choice is kept in localStorage.
 */
export default function Consent() {
  const { lang } = useLanguage();
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = read();
    setChoice(c);
    setOpen(c === null);
    setReady(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  function decide(c: Exclude<Choice, null>) {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* storage unavailable: choice applies to this visit only */
    }
    setChoice(c);
    setOpen(false);
  }

  const ro = lang === "ro";

  return (
    <>
      {ready && choice === "granted" && (
        <>
          <Script id="va-init" strategy="afterInteractive">
            {`window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`}
          </Script>
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" defer />
        </>
      )}
      {ready && open && (
        <div
          role="dialog"
          aria-label={ro ? "Preferințe analytics" : "Analytics preferences"}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              {ro
                ? "Folosim doar stocare strict necesară. Cu acordul tău, măsurăm și vizitele anonim (Vercel Web Analytics, fără cookie-uri publicitare) ca să îmbunătățim OCTOM One. "
                : "We only use strictly necessary storage. With your consent we also measure visits anonymously (Vercel Web Analytics, no advertising cookies) to improve OCTOM One. "}
              <Link href="/cookies" className="underline">
                {ro ? "Detalii" : "Details"}
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                {ro ? "Refuz" : "Decline"}
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-dark"
              >
                {ro ? "Accept" : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
