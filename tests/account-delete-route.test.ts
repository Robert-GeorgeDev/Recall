import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  user: { id: "u1" } as { id: string } | null,
  memberships: [{ organization_id: "o1", user_id: "u1" }] as { organization_id: string; user_id: string }[],
  subs: [{ stripe_subscription_id: "sub_1" }] as { stripe_subscription_id: string }[],
  cancel: vi.fn(),
  rpc: vi.fn(),
  order: [] as string[],
}));

function builder(result: unknown) {
  const b: Record<string, unknown> = {};
  for (const m of ["select", "eq", "in", "not"]) b[m] = () => b;
  b.then = (resolve: (v: unknown) => unknown) => resolve(result);
  return b;
}

vi.mock("@/lib/billing", () => ({
  adminClient: () => ({
    auth: { getUser: async () => ({ data: { user: state.user } }) },
    from: (table: string) =>
      builder({ data: table === "subscriptions" ? state.subs : state.memberships }),
  }),
  stripeClient: () => ({ subscriptions: { cancel: state.cancel } }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ rpc: state.rpc }),
}));

import { POST } from "@/app/api/account/delete/route";

function request(token?: string) {
  return new Request("http://localhost/api/account/delete", {
    method: "POST",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

describe("account delete route", () => {
  beforeEach(() => {
    state.user = { id: "u1" };
    state.memberships = [{ organization_id: "o1", user_id: "u1" }];
    state.subs = [{ stripe_subscription_id: "sub_1" }];
    state.order = [];
    state.cancel.mockReset().mockImplementation(async () => {
      state.order.push("cancel");
    });
    state.rpc.mockReset().mockImplementation(async () => {
      state.order.push("rpc");
      return { error: null };
    });
  });

  it("rejects requests without a valid token", async () => {
    expect((await POST(request())).status).toBe(403);
    state.user = null;
    expect((await POST(request("bad"))).status).toBe(403);
    expect(state.cancel).not.toHaveBeenCalled();
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it("cancels the subscription before deleting", async () => {
    const res = await POST(request("t"));
    expect(res.status).toBe(200);
    expect(state.cancel).toHaveBeenCalledWith("sub_1");
    expect(state.order).toEqual(["cancel", "rpc"]);
  });

  it("refuses without touching Stripe when the workspace has other members", async () => {
    state.memberships.push({ organization_id: "o1", user_id: "u2" });
    const res = await POST(request("t"));
    expect(res.status).toBe(409);
    expect(state.cancel).not.toHaveBeenCalled();
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it("stops when Stripe cancellation fails", async () => {
    state.cancel.mockRejectedValue({ code: "api_error" });
    const res = await POST(request("t"));
    expect(res.status).toBe(502);
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it("continues when the subscription no longer exists on Stripe", async () => {
    state.cancel.mockRejectedValue({ code: "resource_missing" });
    const res = await POST(request("t"));
    expect(res.status).toBe(200);
    expect(state.rpc).toHaveBeenCalled();
  });

  it("maps a database refusal to 409", async () => {
    state.rpc.mockResolvedValue({ error: { message: "members_exist" } });
    expect((await POST(request("t"))).status).toBe(409);
  });
});
