import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  upsert: vi.fn(),
  retrieve: vi.fn(),
  event: null as unknown,
}));

vi.mock("@/lib/billing", () => ({
  planFromPrice: (id?: string) => (id === "price_pro" ? "pro" : null),
  adminClient: () => ({ from: () => ({ upsert: state.upsert }) }),
  stripeClient: () => ({
    webhooks: { constructEvent: () => state.event },
    subscriptions: { retrieve: state.retrieve },
  }),
}));

import { POST } from "@/app/api/stripe/webhook/route";

describe("stripe webhook", () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    state.upsert.mockReset().mockResolvedValue({ error: null });
    // By default Stripe's current state matches the event.
    state.retrieve.mockReset().mockImplementation(async () => (state.event as { data: { object: unknown } }).data.object);
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

  it("syncs the subscription from the event", async () => {
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

  it("uses Stripe's current state, so an old event cannot undo a cancellation", async () => {
    state.retrieve.mockResolvedValue({
      id: "sub_1",
      status: "canceled",
      customer: "cus_1",
      metadata: { org_id: "o1" },
      items: { data: [{ price: { id: "price_pro" } }] },
    });
    const res = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "sig" },
        body: "{}",
      })
    );
    expect(res.status).toBe(200);
    expect(state.retrieve).toHaveBeenCalledWith("sub_1");
    const [row] = state.upsert.mock.calls[0];
    expect(row).toMatchObject({ plan: "free", status: "canceled", stripe_subscription_id: null });
  });

  it("still rejects unsigned requests", async () => {
    const res = await POST(
      new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" })
    );
    expect(res.status).toBe(400);
    expect(state.upsert).not.toHaveBeenCalled();
  });
});
