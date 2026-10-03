import { describe, expect, it } from "vitest";
import { buildCsv, parseContactsCsv } from "@/lib/csv";

const HEADER =
  "first_name,last_name,company,email,phone,status,notes,next_followup";

describe("parseContactsCsv", () => {
  it("parses a valid file", () => {
    const res = parseContactsCsv(
      `${HEADER}\nMaria,Ionescu,Bright Agency,maria@example.com,+40 700 000 000,Contacted,Call,2026-10-15`
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.rows).toHaveLength(1);
    expect(res.badRows).toBe(0);
    expect(res.rows[0].contact.first_name).toBe("Maria");
    expect(res.rows[0].contact.status).toBe("Contacted");
    expect(res.rows[0].nextFollowup).toBe("2026-10-15");
  });

  it("accepts semicolons (Excel in Romanian) and a BOM", () => {
    const res = parseContactsCsv("\uFEFFfirst_name;last_name\nAna;Pop");
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.rows[0].contact.first_name).toBe("Ana");
    expect(res.rows[0].contact.last_name).toBe("Pop");
  });

  it("defaults the status to New and ignores the case of statuses", () => {
    const res = parseContactsCsv(
      `${HEADER}\nAna,,,,,,,\nBob,,,,,proposal sent,,`
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.rows[0].contact.status).toBe("New");
    expect(res.rows[1].contact.status).toBe("Proposal Sent");
  });

  it("skips rows with problems and says why", () => {
    const res = parseContactsCsv(
      [
        HEADER,
        "Ok,One,,one@example.com,,New,,2026-10-15",
        ",NoName,,,,,,",
        "Bad,Email,,not-an-email,,,,",
        "Bad,Status,,,,Hot,,",
        "Bad,Date,,,,,,2026-02-30",
      ].join("\n")
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.rows).toHaveLength(1);
    expect(res.badRows).toBe(4);
    const codes = res.issues.map((i) => i.code);
    expect(codes).toContain("first_name_required");
    expect(codes).toContain("email_invalid");
    expect(codes).toContain("status_invalid");
    expect(codes).toContain("date_invalid");
    expect(res.issues.find((i) => i.code === "first_name_required")?.row).toBe(3);
  });

  it("flags values that are too long", () => {
    const res = parseContactsCsv(`${HEADER}\n${"A".repeat(81)},,,,,,,`);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.badRows).toBe(1);
    expect(res.issues[0].code).toBe("too_long");
    expect(res.issues[0].field).toBe("first_name");
  });

  it("rejects files without a first_name column", () => {
    expect(parseContactsCsv("name,email\nAna,a@b.co")).toEqual({
      ok: false,
      error: "noFirstName",
    });
  });

  it("rejects empty files", () => {
    expect(parseContactsCsv("")).toEqual({ ok: false, error: "empty" });
    expect(parseContactsCsv("first_name,last_name")).toEqual({
      ok: false,
      error: "empty",
    });
  });

  it("rejects more than 500 rows", () => {
    const rows = Array.from({ length: 501 }, (_, i) => `Person${i},X`);
    expect(
      parseContactsCsv(["first_name,last_name", ...rows].join("\n"))
    ).toEqual({ ok: false, error: "tooMany" });
  });
});

describe("buildCsv", () => {
  it("writes the header and CRLF line endings", () => {
    const csv = buildCsv([["Ana", "Pop", "", "", "", "New", "", ""]]);
    expect(csv.startsWith(`${HEADER}\r\n`)).toBe(true);
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("neutralises spreadsheet formulas", () => {
    const csv = buildCsv([["=1+1", "@cmd", "-1+2x", "+SUM(A1)", "", "", "", ""]]);
    expect(csv).toContain("'=1+1");
    expect(csv).toContain("'@cmd");
    expect(csv).toContain("'-1+2x");
    expect(csv).toContain("'+SUM(A1)");
  });

  it("leaves phone numbers untouched", () => {
    const csv = buildCsv([["Ana", "", "", "", "+40 700 000 000", "", "", ""]]);
    expect(csv).toContain("+40 700 000 000");
    expect(csv).not.toContain("'+40");
  });

  it("quotes commas and quotation marks", () => {
    const csv = buildCsv([["a,b", 'say "hi"', "", "", "", "", "", ""]]);
    expect(csv).toContain('"a,b"');
    expect(csv).toContain('"say ""hi"""');
  });

  it("survives an export followed by an import", () => {
    const csv = buildCsv([
      [
        "Ana",
        "Pop",
        "Acme, Inc.",
        "ana@example.com",
        "+40 700 000 000",
        "Won",
        'Said "yes"\nsecond line',
        "2026-10-15",
      ],
    ]);
    const res = parseContactsCsv(csv);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.rows).toHaveLength(1);
    const c = res.rows[0].contact;
    expect(c.company).toBe("Acme, Inc.");
    expect(c.phone).toBe("+40 700 000 000");
    expect(c.status).toBe("Won");
    expect(c.notes).toBe('Said "yes"\nsecond line');
    expect(res.rows[0].nextFollowup).toBe("2026-10-15");
  });
});
