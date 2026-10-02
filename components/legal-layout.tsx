import Link from "next/link";
import Logo from "@/components/logo";
import { isDraft, LEGAL } from "@/lib/legal";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <nav className="flex gap-4 text-sm font-semibold text-brand" aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>
      </div>

      {isDraft && (
        <p
          role="note"
          className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Draft: fill in your details in lib/legal.ts and have this text reviewed
          by a legal professional before launch.
        </p>
      )}

      <h1 className="mt-8 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated: {LEGAL.updated}</p>

      <div className="mt-6 text-sm leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-brand [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
