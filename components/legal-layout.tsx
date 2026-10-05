"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import LegalNav from "@/components/legal-nav";
import LegalToc from "@/components/legal-toc";
import { CookieSettingsButton } from "@/components/consent";
import { useLanguage } from "@/components/language-provider";
import { isDraft, LEGAL } from "@/lib/legal";

export default function LegalLayout({
  title,
  titleRo,
  children,
}: {
  title: string;
  titleRo: string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const ro = lang === "ro";
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft"
          >
            {ro ? "Autentificare" : "Log in"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-10">
        <LegalNav />

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-ink">{ro ? titleRo : title}</h1>
        <p className="mt-2 text-sm text-slate-500">{ro ? "Ultima actualizare" : "Last updated"}: {LEGAL.updated}</p>

        {isDraft && (
          <p
            role="note"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            {ro
              ? "Ciornă. Acest text nu este final și se poate schimba înainte de lansare."
              : "Draft. This text is not final and may change before launch."}
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <LegalToc key={lang} label={ro ? "Pe această pagină" : "On this page"} />
            </div>
          </aside>

          <article
            id="legal-content"
            className="max-w-[68ch] text-[15px] leading-7 text-slate-700 [&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:scroll-mt-8 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_h2:first-of-type]:mt-8 [&_li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6"
          >
            {children}
          </article>
        </div>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} {LEGAL.name}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy" className="hover:text-ink">{ro ? "Confidențialitate" : "Privacy"}</Link>
            <Link href="/terms" className="hover:text-ink">{ro ? "Termeni" : "Terms"}</Link>
            <Link href="/cookies" className="hover:text-ink">Cookies</Link>
            <CookieSettingsButton className="hover:text-ink" />
            <Link href="/refunds" className="hover:text-ink">{ro ? "Rambursări" : "Refunds"}</Link>
            <Link href="/subprocessors" className="hover:text-ink">{ro ? "Subprocesatori" : "Subprocessors"}</Link>
            <Link href="/security" className="hover:text-ink">{ro ? "Securitate" : "Security"}</Link>
            <Link href="/accessibility" className="hover:text-ink">{ro ? "Accesibilitate" : "Accessibility"}</Link>
            <Link href="/company" className="hover:text-ink">{ro ? "Companie" : "Company"}</Link>
            <Link href="/contact" className="hover:text-ink">{ro ? "Contact" : "Contact"}</Link>
            <Link href="/" className="hover:text-ink">{ro ? "Acasă" : "Home"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
