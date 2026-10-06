import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LEGAL_SLUGS } from "../lib/legal-content";
import { fillTokens, parseInline, parseMarkdown, safeHref } from "../lib/legal-markdown";

const dir = path.join(process.cwd(), "content", "legal");
const read = (slug: string, lang: string) => fs.readFileSync(path.join(dir, `${slug}.${lang}.md`), "utf8");

describe("legal markdown reader", () => {
  it("reads headings, lists, bold and links", () => {
    const blocks = parseMarkdown("## Title\n\nHello **world** [a](/x)\nsecond line\n\n* one\n* two\n");
    expect(blocks[0]).toEqual({ t: "h2", v: "Title" });
    expect(blocks[1].t).toBe("p");
    expect(blocks[2]).toMatchObject({ t: "ul" });
    expect((blocks[2] as { items: unknown[] }).items).toHaveLength(2);
  });

  it("keeps a link inside bold", () => {
    const [node] = parseInline("**[mail](mailto:a@b.c)**");
    expect(node.t).toBe("bold");
  });

  it("reads tables without the separator row", () => {
    const [t] = parseMarkdown("| A | B |\n| --- | --- |\n| 1 | 2 |\n");
    expect(t).toMatchObject({ t: "table" });
    expect((t as { rows: unknown[] }).rows).toHaveLength(1);
  });

  it("only allows safe link targets", () => {
    expect(safeHref("https://octom.eu")).toBe(true);
    expect(safeHref("mailto:contact@octom.eu")).toBe(true);
    expect(safeHref("/terms")).toBe(true);
    expect(safeHref("javascript:alert(1)")).toBe(false);
    expect(safeHref("http://insecure.example")).toBe(false);
  });

  it("fills known tokens and leaves unknown ones", () => {
    expect(fillTokens("{{a}} {{b}}", { a: "x" })).toBe("x {{b}}");
  });
});

describe.each(LEGAL_SLUGS)("legal page %s", (slug) => {
  const ro = read(slug, "ro");
  const en = read(slug, "en");

  it("exists in both languages with the same sections", () => {
    const h2 = (s: string) => parseMarkdown(s).filter((b) => b.t === "h2").length;
    expect(h2(ro)).toBeGreaterThan(0);
    expect(h2(en)).toBe(h2(ro));
  });

  it("has no leftover placeholders, old addresses or unknown tokens", () => {
    for (const text of [ro, en]) {
      expect(text).not.toMatch(/legal@octom\.eu/);
      expect(text).not.toMatch(/\[(DENUMIREA|ADRESA|CUI|FORMA|S\.R\.L)/i);
      const tokens = [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
      for (const t of tokens)
        expect(["legalName", "legalForm", "address", "companyId", "registryNo", "email"]).toContain(t);
    }
  });

  it("uses only safe links", () => {
    for (const text of [ro, en]) {
      for (const m of text.matchAll(/\]\(([^)]+)\)/g)) expect(safeHref(m[1])).toBe(true);
    }
  });
});

describe("paid plans wording", () => {
  it.each(["terms", "refunds"])("%s says the launch period is free", (slug) => {
    expect(read(slug, "ro")).toMatch(/perioada de lansare, Octom este (oferit )?gratuit/);
    expect(read(slug, "en")).toMatch(/During the launch period, Octom is (offered )?free/);
  });

  it("terms do not forbid what the AGPL allows", () => {
    expect(read("terms", "ro")).toMatch(/AGPL-3\.0/);
    expect(read("terms", "en")).toMatch(/AGPL-3\.0/);
  });
});
