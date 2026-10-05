import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  result: { data: null, error: null } as {
    data: { value: unknown } | null;
    error: { code?: string } | null;
  },
  asked: [] as string[],
}));

vi.mock("@/lib/billing", () => ({
  adminClient: () => ({
    from: (table: string) => {
      state.asked.push(table);
      const b = {
        select: () => b,
        eq: () => b,
        maybeSingle: async () => state.result,
      };
      return b;
    },
  }),
}));

import { getBootstrapMode } from "@/lib/bootstrap";

describe("getBootstrapMode", () => {
  beforeEach(() => {
    state.result = { data: null, error: null };
    state.asked = [];
  });

  it("reads app_settings on the server", async () => {
    state.result = { data: { value: true }, error: null };
    expect(await getBootstrapMode()).toBe(true);
    expect(state.asked).toEqual(["app_settings"]);
  });

  it("is OFF when the stored value is false or the row is missing", async () => {
    state.result = { data: { value: false }, error: null };
    expect(await getBootstrapMode()).toBe(false);
    state.result = { data: null, error: null };
    expect(await getBootstrapMode()).toBe(false);
  });

  it("only treats a real boolean true as ON", async () => {
    for (const value of ["true", 1, "on", {}]) {
      state.result = { data: { value }, error: null };
      expect(await getBootstrapMode()).toBe(false);
    }
  });

  it("is OFF before the SQL has been run (table missing)", async () => {
    state.result = { data: null, error: { code: "42P01" } };
    expect(await getBootstrapMode()).toBe(false);
    state.result = { data: null, error: { code: "PGRST205" } };
    expect(await getBootstrapMode()).toBe(false);
  });

  it("throws on any other error so purchases fail closed", async () => {
    state.result = { data: null, error: { code: "XX000" } };
    await expect(getBootstrapMode()).rejects.toThrow("settings_unreadable");
  });
});
