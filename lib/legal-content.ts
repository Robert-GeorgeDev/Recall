import fs from "node:fs";
import path from "node:path";

export const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "cookies",
  "refunds",
  "subprocessors",
  "security",
  "accessibility",
  "company",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** Reads the Romanian and English text of a legal page (content/legal/<slug>.<lang>.md). */
export function loadLegalDoc(slug: LegalSlug): { ro: string; en: string } {
  const read = (lang: "ro" | "en") =>
    fs.readFileSync(path.join(process.cwd(), "content", "legal", `${slug}.${lang}.md`), "utf8");
  return { ro: read("ro"), en: read("en") };
}
