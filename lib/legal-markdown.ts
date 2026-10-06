// Tiny markdown reader for the legal pages. It supports only what those pages use:
// ## / ### headings, paragraphs, bullet and numbered lists, tables, **bold**,
// `code` and [links](url). Everything is turned into plain data, never into raw HTML.

export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: Inline[] }
  | { t: "code"; v: string }
  | { t: "link"; v: string; href: string };

export type Block =
  | { t: "h2"; v: string }
  | { t: "h3"; v: string }
  | { t: "p"; lines: Inline[][] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; items: Inline[][] }
  | { t: "table"; head: Inline[][]; rows: Inline[][][] }
  | { t: "hr" };

const TOKEN = /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  for (const part of text.split(TOKEN)) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push({ t: "bold", v: parseInline(part.slice(2, -2)) });
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push({ t: "code", v: part.slice(1, -1) });
    } else {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (m) out.push({ t: "link", v: m[1], href: m[2] });
      else out.push({ t: "text", v: part });
    }
  }
  return out;
}

/** Only these link targets are allowed; anything else is shown as plain text. */
export function safeHref(href: string): boolean {
  return /^(https:\/\/|mailto:|\/)/.test(href);
}

export function fillTokens(md: string, values: Record<string, string>): string {
  return md.replace(/\{\{(\w+)\}\}/g, (all, key: string) => values[key] ?? all);
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ t: "h3", v: line.slice(4).trim() });
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push({ t: "h2", v: line.slice(3).trim() });
      i++;
    } else if (/^-{3,}$/.test(line.trim())) {
      blocks.push({ t: "hr" });
      i++;
    } else if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(cells(lines[i]));
        i++;
      }
      const body = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c)));
      const [head, ...rest] = body;
      blocks.push({
        t: "table",
        head: head.map(parseInline),
        rows: rest.map((r) => r.map(parseInline)),
      });
    } else if (/^\s*[*-] /.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*[*-] /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\s*[*-] /, "").trim()));
        i++;
      }
      blocks.push({ t: "ul", items });
    } else if (/^\s*\d+\. /.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\s*\d+\. /, "").trim()));
        i++;
      }
      blocks.push({ t: "ol", items });
    } else {
      const para: Inline[][] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{2,3} |\||\s*[*-] |\s*\d+\. |-{3,}$)/.test(lines[i])
      ) {
        para.push(parseInline(lines[i].trim()));
        i++;
      }
      blocks.push({ t: "p", lines: para });
    }
  }
  return blocks;
}
