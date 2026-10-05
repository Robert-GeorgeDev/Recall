import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  bootstrap: false as boolean | "error",
  user: { id: "u1", email: "owner@example.com" } as { id: string; email: string } | null,
  create: vi.fn(),
}));

vi.mock("@/lib/bootstrap", () => ({
  BOOTSTRAP_BLOCKED_MESSAGE: "Paid subscriptions are temporarily unavailable.",
  getBootstrapMode: async () => {
    if (state.bootstrap === "error") throw new Error("settings_unreadable");
    return state.bootstrap;
  },
}));

vi.mock("@/lib/billing", () => {
  const b = {
    select: () => b,
    eq: () => b,
    maybeSingle: async () => ({ data: null }),
  };
  return {
    adminClient: () => ({ from: () => b }),
    authorize: async () => state.user,
    originOf: () => "http://localhost",
    priceFor: (plan: string) => `price_${plan}`,
    stripeClient: () => ({ checkout: { sessions: { create: state.create } } }),
  };
});

import { POST } from "@/app/api/billing/checkout/route";

function request(body: unknown) {
  return new Request("http://localhost/api/billing/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer t" },
    body: JSON.stringify(body),
  });
}

describe("checkout route and Bootstrap Mode", () => {
  beforeEach(() => {
    state.bootstrap = false;
    state.user = { id: "u1", email: "owner@example.com" };
    state.create.mockReset().mockResolvedValue({ url: "https://stripe.test/session" });
  });

  it("refuses Pro and Business checkout on the server while ON", async () => {
    state.bootstrap = true;
    for (const plan of ["pro", "business"]) {
      const res = await POST(request({ orgId: "o1", plan }));
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe("bootstrap_mode");
      expect(json.message).toBe("Paid subscriptions are temporarily unavailable.");
    }
    expect(state.create).not.toHaveBeenCalled();
  });

  it("ignores anything the client says about Bootstrap Mode or the plan", async () => {
    state.bootstrap = true;
    const res = await POST(
      request({ orgId: "o1", plan: "pro", bootstrap_mode: false, bootstrapMode: false })
    );
    expect(res.status).toBe(403);
    expect(state.create).not.toHaveBeenCalled();
  });

  it("fails closed when the setting cannot be read", async () => {
    state.bootstrap = "error";
    const res = await POST(request({ orgId: "o1", plan: "pro" }));
    expect(res.status).toBe(500);
    expect(state.create).not.toHaveBeenCalled();
  });

  it("still creates the Stripe session while OFF", async () => {
    const res = await POST(request({ orgId: "o1", plan: "pro" }));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toBe("https://stripe.test/session");
    expect(state.create).toHaveBeenCalledTimes(1);
  });

  it("keeps rejecting a client-chosen plan that is not sold, even while OFF", async () => {
    expect((await POST(request({ orgId: "o1", plan: "enterprise" }))).status).toBe(400);
    expect((await POST(request({ orgId: "o1", plan: "free" }))).status).toBe(400);
    expect(state.create).not.toHaveBeenCalled();
  });

  it("still requires workspace owner or admin while OFF", async () => {
    state.user = null;
    expect((await POST(request({ orgId: "o1", plan: "pro" }))).status).toBe(403);
    expect(state.create).not.toHaveBeenCalled();
  });
});
