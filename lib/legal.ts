// Fill in your details here. The legal pages show a "Draft" banner
// until every value below is real (no square brackets left).
export const LEGAL = {
  name: "OCTOM",
  address: "[Your address, Romania]",
  email: "contact@octom.eu",
  legalEmail: "[legal email]",
  companyId: "[CUI]",
  registryNo: "[J../../..]",
  updated: "5 October 2026",
};

export const isDraft = Object.values(LEGAL).some((v) => v.includes("["));
