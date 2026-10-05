import Papa from "papaparse";
import { STATUSES, type Status } from "@/types/contact";

export const CSV_COLUMNS = [
  "first_name",
  "last_name",
  "company",
  "email",
  "phone",
  "status",
  "notes",
  "next_followup",
] as const;

export const MAX_ROWS = 500;
export const MAX_FILE_BYTES = 1_000_000;

const LIMITS: Record<string, number> = {
  first_name: 80,
  last_name: 80,
  company: 120,
  email: 200,
  phone: 40,
  notes: 5000,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ImportContact = {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  notes: string;
};

export type ImportRow = {
  row: number;
  contact: ImportContact;
  nextFollowup: string | null;
};

export type RowIssue = { row: number; code: string; field?: string };

export type ParseResult =
  | { ok: false; error: "empty" | "noFirstName" | "tooMany" | "read" }
  | { ok: true; rows: ImportRow[]; issues: RowIssue[]; badRows: number };

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

export function parseContactsCsv(text: string): ParseResult {
  if (text.trim() === "") return { ok: false, error: "empty" };

  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h: string) =>
      h.replace(/^\uFEFF/, "").trim().toLowerCase(),
  });

  const fields = result.meta.fields ?? [];
  if (!fields.includes("first_name")) {
    return { ok: false, error: "noFirstName" };
  }

  const data = result.data;
  if (data.length === 0) return { ok: false, error: "empty" };
  if (data.length > MAX_ROWS) return { ok: false, error: "tooMany" };

  const rows: ImportRow[] = [];
  const issues: RowIssue[] = [];
  let badRows = 0;

  data.forEach((raw, index) => {
    const row = index + 2; // row 1 is the header
    const get = (key: string) => String(raw[key] ?? "").trim();
    const rowIssues: RowIssue[] = [];

    const firstName = get("first_name");
    if (!firstName) rowIssues.push({ row, code: "first_name_required" });

    for (const field of Object.keys(LIMITS)) {
      if (get(field).length > LIMITS[field]) {
        rowIssues.push({ row, code: "too_long", field });
      }
    }

    const email = get("email");
    if (email && !EMAIL.test(email)) {
      rowIssues.push({ row, code: "email_invalid" });
    }

    let status: Status = "New";
    const statusRaw = get("status");
    if (statusRaw) {
      const found = STATUSES.find(
        (s) => s.toLowerCase() === statusRaw.toLowerCase()
      );
      if (found) status = found;
      else rowIssues.push({ row, code: "status_invalid" });
    }

    let nextFollowup: string | null = null;
    const dateRaw = get("next_followup");
    if (dateRaw) {
      if (isRealDate(dateRaw)) nextFollowup = dateRaw;
      else rowIssues.push({ row, code: "date_invalid" });
    }

    if (rowIssues.length > 0) {
      issues.push(...rowIssues);
      badRows += 1;
      return;
    }

    rows.push({
      row,
      contact: {
        first_name: firstName,
        last_name: get("last_name"),
        company: get("company"),
        email,
        phone: get("phone"),
        status,
        notes: get("notes"),
      },
      nextFollowup,
    });
  });

  return { ok: true, rows, issues, badRows };
}

// Protects against "CSV injection": cells that a spreadsheet could run as a
// formula get a leading apostrophe. Phone-like values such as "+40 700 000 000"
// are left untouched.
function escapeCell(value: string): string {
  let v = value;
  const looksLikeNumber = /^[+-]?[\d\s().-]+$/.test(v);
  if (/^[=@\t\r]/.test(v) || (/^[+-]/.test(v) && !looksLikeNumber)) {
    v = "'" + v;
  }
  if (/[",\n\r]/.test(v)) {
    v = '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

export function buildCsv(rows: string[][]): string {
  const lines = [
    CSV_COLUMNS.join(","),
    ...rows.map((r) => r.map(escapeCell).join(",")),
  ];
  return lines.join("\r\n") + "\r\n";
}

// Builds a CSV with custom headers (used for the extra exports).
export function buildTable(headers: string[], rows: string[][]): string {
  const lines = [headers.join(","), ...rows.map((r) => r.map(escapeCell).join(","))];
  return lines.join("\r\n") + "\r\n";
}

export function downloadCsv(filename: string, content: string) {
  // The BOM makes Excel read accents (ă, â, î, ș, ț) correctly.
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
