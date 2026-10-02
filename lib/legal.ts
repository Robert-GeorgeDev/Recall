// Fill in your details here. The legal pages show a "Draft" banner
// until every value below is real (no square brackets left).
export const LEGAL = {
  name: "[Your legal name or company name]",
  address: "[Your address, Romania]",
  email: "[Your contact email]",
  updated: "2 October 2026",
};

export const isDraft =
  LEGAL.name.includes("[") ||
  LEGAL.address.includes("[") ||
  LEGAL.email.includes("[");
