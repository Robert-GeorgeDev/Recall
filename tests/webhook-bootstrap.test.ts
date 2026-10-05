import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  upsert: vi.fn(),
  event: null as unknown,
}));

// Bootstrap Mode must not influence webhook handling. If the handler ever asks
// for the setting, this test fails.
vi.mock("@/lib/bootstrap", () => ({
  getBootstrapMode: () => {
    throw new Error("webhook must not read Bootstrap Mode");
  },
}));

vi.mock("@/lib/billing", () => ({
  planFromPrice: (id?: string) => (id === "price_pro" ? "pro" : null),
  adminClient: () => ({ from: () => ({ upsert: state.upsert }) }),
  stripeClient: () => ({
    webhooks: { constructEvent: () => state.event },
    subscriptions: { retrieve: vi.fn() },
  }),
}));

import { POST } from "@/app/api/stripe/webhook/route";

describe("stripe webhook", () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    state.upsert.mockReset().mockResolvedValue({ error: null });
    state.event = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_1",
          status: "active",
          customer: "cus_1",
          metadata: { org_id: "o1" },
          items: { data: [{ price: { id: "price_pro" }, current_period_end: 1800000000 }] },
        },
      },
    };
  });

  it("keeps syncing existing subscriptions regardless of Bootstrap Mode", async () => {
    const res = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      })
    );
    expect(res.status).toBe(200);
    expect(state.upsert).toHaveBeenCalledTimes(1);
    const [row] = state.upsert.mock.calls[0];
    expect(row).toMatchObject({
      organization_id: "o1",
      plan: "pro",
      status: "active",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
    });
  });

  it("still rejects unsigned requests", async () => {
    const res = await POST(
      new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" })
    );
    expect(res.status).toBe(400);
    expect(state.upsert).not.toHaveBeenCalled();
  });
});
