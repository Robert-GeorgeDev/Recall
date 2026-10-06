// Fill in your details here. The legal pages show a "Draft" banner
// until every value below is real (no square brackets left).
export const LEGAL = {
  name: "OCTOM",
  legalName: "[Denumirea completă a societății]",
  legalForm: "[S.R.L.]",
  address: "[Adresa sediului social, România]",
  email: "contact@octom.eu",
  companyId: "[CUI]",
  registryNo: "[J../../..]",
  updated: "2026-10-06",
};

export const isDraft = Object.values(LEGAL).some((v) => v.includes("["));

export function formatUpdated(iso: string, lang: "ro" | "en"): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
