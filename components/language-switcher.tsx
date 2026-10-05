"use client";

import { useLanguage } from "@/components/language-provider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex rounded-full border border-line bg-white p-0.5 text-xs font-semibold"
    >
      {(["en", "ro"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase ${
            lang === l ? "bg-ink text-white" : "text-slate-600 hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
