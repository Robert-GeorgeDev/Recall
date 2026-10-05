"use client";

import { useLanguage } from "@/components/language-provider";

// Shows the Romanian or English version of a block, following the site language.
export default function Bi({ en, ro }: { en: React.ReactNode; ro: React.ReactNode }) {
  const { lang } = useLanguage();
  return <>{lang === "ro" ? ro : en}</>;
}
