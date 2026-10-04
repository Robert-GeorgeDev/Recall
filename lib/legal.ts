// Fill in your details here. The legal pages show a "Draft" banner
// until every value below is real (no square brackets left).
export const LEGAL = {
  name: "OCTOM",
  address: "[Your address, Romania]",
  email: "contact@octom.com",
  updated: "4 October 2026",
};

export const isDraft =
  LEGAL.name.includes("[") ||
  LEGAL.address.includes("[") ||
  LEGAL.email.includes("[");
