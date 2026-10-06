"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useLanguage } from "@/components/language-provider";
import { LEGAL } from "@/lib/legal";
import {
  fillTokens,
  parseMarkdown,
  safeHref,
  type Block,
  type Inline,
} from "@/lib/legal-markdown";

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.t === "text") return <Fragment key={i}>{n.v}</Fragment>;
        if (n.t === "code")
          return (
            <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-ink">
              {n.v}
            </code>
          );
        if (n.t === "bold")
          return (
            <strong key={i}>
              <Inlines nodes={n.v} />
            </strong>
          );
        if (!safeHref(n.href)) return <Fragment key={i}>{n.v}</Fragment>;
        if (n.href.startsWith("/") && !n.href.startsWith("/.well-known"))
          return (
            <Link key={i} href={n.href}>
              {n.v}
            </Link>
          );
        const external = n.href.startsWith("https://");
        return (
          <a
            key={i}
            href={n.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {n.v}
          </a>
        );
      })}
    </>
  );
}

function Lines({ lines }: { lines: Inline[][] }) {
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <Inlines nodes={l} />
        </Fragment>
      ))}
    </>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "h2":
      return <h2>{b.v}</h2>;
    case "h3":
      return <h3 className="mt-6 text-base font-semibold text-ink">{b.v}</h3>;
    case "p":
      return (
        <p>
          <Lines lines={b.lines} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {b.items.map((it, i) => (
            <li key={i}>
              <Inlines nodes={it} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {b.items.map((it, i) => (
            <li key={i}>
              <Inlines nodes={it} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-brand-soft text-ink">
              <tr>
                {b.head.map((c, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">
                    <Inlines nodes={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  {r.map((c, j) => (
                    <td key={j} className="px-3 py-2">
                      <Inlines nodes={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

/** Shows the Romanian or English markdown text, following the site language. */
export default function LegalDoc({ ro, en }: { ro: string; en: string }) {
  const { lang } = useLanguage();
  const text = fillTokens(lang === "ro" ? ro : en, {
    legalName: LEGAL.legalName,
    legalForm: LEGAL.legalForm,
    address: LEGAL.address,
    companyId: LEGAL.companyId,
    registryNo: LEGAL.registryNo,
    email: LEGAL.email,
  });
  const blocks = parseMarkdown(text);
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </>
  );
}
