import { describe, expect, it } from "vitest";
import { dictionaries } from "@/lib/dictionaries";
import { STATUSES } from "@/types/contact";
import { PRIORITIES } from "@/types/followup";

const en = dictionaries.en as Record<string, string>;
const ro = dictionaries.ro as Record<string, string>;

describe("dictionaries", () => {
  it("has the same keys in English and Romanian", () => {
    expect(Object.keys(ro).sort()).toEqual(Object.keys(en).sort());
  });

  it("has no empty texts", () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value.trim(), `en:${key}`).not.toBe("");
    }
    for (const [key, value] of Object.entries(ro)) {
      expect(value.trim(), `ro:${key}`).not.toBe("");
    }
  });

  it("keeps the same {placeholders} in both languages", () => {
    const placeholders = (s: string) => (s.match(/\{[a-z]+\}/gi) ?? []).sort();
    for (const key of Object.keys(en)) {
      expect(placeholders(ro[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it("translates every lead status and priority", () => {
    for (const s of STATUSES) {
      expect(en["status." + s], `en status.${s}`).toBeTruthy();
      expect(ro["status." + s], `ro status.${s}`).toBeTruthy();
    }
    for (const p of PRIORITIES) {
      expect(en["priority." + p], `en priority.${p}`).toBeTruthy();
      expect(ro["priority." + p], `ro priority.${p}`).toBeTruthy();
    }
  });
});
