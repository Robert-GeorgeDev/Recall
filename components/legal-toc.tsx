"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function LegalToc({ label }: { label: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const heads = Array.from(
      document.querySelectorAll<HTMLElement>("#legal-content h2")
    );
    const used = new Set<string>();
    const list: Item[] = heads.map((h, i) => {
      let id = h.id || slugify(h.textContent ?? "") || `section-${i + 1}`;
      while (used.has(id)) id = `${id}-${i + 1}`;
      used.add(id);
      h.id = id;
      return { id, text: h.textContent ?? "" };
    });
    setItems(list);

    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    heads.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <ol className="mt-3 space-y-1 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1 pl-4 text-sm ${
                active === item.id
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent text-slate-600 hover:text-ink"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
