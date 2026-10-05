import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  isAdmin: false,
  rpc: vi.fn(),
  setting: { value: false, updated_at: "2026-10-05T10:00:00Z", updated_by: "admin-1" } as {
    value: boolean;
    updated_at: string;
    updated_by: string;
  } | null,
  tokens: [] as string[],
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: (_url: string, _key: string, opts: { global: { headers: { Authorization: string } } }) => {
    state.tokens.push(opts.global.headers.Authorization);
    const b = {
      select: () => b,
      eq: () => b,
      // Row level security: only a platform admin can read app_settings.
      maybeSingle: async () => ({ data: state.isAdmin ? state.setting : null, error: null }),
    };
    return { rpc: state.rpc, from: () => b };
  },
}));

import { GET, POST } from "@/app/api/admin/bootstrap/route";

function request(method: "GET" | "POST", body?: unknown, token: string | null = "tok") {
  return new Request("http://localhost/api/admin/bootstrap", {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      "content-type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("admin bootstrap route", () => {
  beforeEach(() => {
    state.isAdmin = false;
    state.tokens = [];
    state.setting = { value: false, updated_at: "2026-10-05T10:00:00Z", updated_by: "admin-1" };
    state.rpc.mockReset().mockImplementation(async (name: string, args?: { enabled?: boolean }) => {
      if (name === "is_platform_admin") return { data: state.isAdmin, error: null };
      if (name === "set_bootstrap_mode") {
        if (!state.isAdmin) return { data: null, error: { code: "42501" } };
        state.setting = { ...state.setting!, value: args?.enabled === true };
        return { data: args?.enabled, error: null };
      }
      return { data: null, error: { code: "42883" } };
    });
  });

  it("refuses requests without a token", async () => {
    expect((await GET(request("GET", undefined, null))).status).toBe(403);
    expect((await POST(request("POST", { enabled: true }, null))).status).toBe(403);
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it("refuses a normal user from reading the setting", async () => {
    const res = await GET(request("GET"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "forbidden" });
  });

  it("refuses a normal user from changing the setting", async () => {
    const res = await POST(request("POST", { enabled: true }));
    expect(res.status).toBe(403);
    expect(state.setting?.value).toBe(false);
  });

  it("lets an admin read the setting", async () => {
    state.isAdmin = true;
    const res = await GET(request("GET"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      enabled: false,
      updatedAt: "2026-10-05T10:00:00Z",
      updatedBy: "admin-1",
    });
  });

  it("lets an admin change the setting through the database function", async () => {
    state.isAdmin = true;
    const res = await POST(request("POST", { enabled: true }));
    expect(res.status).toBe(200);
    expect((await res.json()).enabled).toBe(true);
    expect(state.rpc).toHaveBeenCalledWith("set_bootstrap_mode", { enabled: true });
  });

  it("runs every call with the caller's own token", async () => {
    state.isAdmin = true;
    await GET(request("GET", undefined, "caller-token"));
    expect(state.tokens).toEqual(["Bearer caller-token"]);
  });

  it("rejects anything that is not a real boolean", async () => {
    state.isAdmin = true;
    for (const body of [{}, { enabled: "true" }, { enabled: 1 }, { plan: "pro" }, { bootstrap_mode: true }, null]) {
      expect((await POST(request("POST", body))).status).toBe(400);
    }
    expect(state.rpc).not.toHaveBeenCalled();
  });
});
