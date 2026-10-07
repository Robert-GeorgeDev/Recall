import { describe, expect, it } from "vitest";
import {
  FREE_LIMITS,
  planFromSubscription,
  resolveEntitlements,
} from "@/lib/entitlements";

const activePro = { plan: "pro", status: "active" };
const activeBusiness = { plan: "business", status: "trialing" };

describe("planFromSubscription", () => {
  it("falls back to free without an active paid subscription", () => {
    expect(planFromSubscription(null)).toBe("free");
    expect(planFromSubscription({ plan: "pro", status: "canceled" })).toBe("free");
    expect(planFromSubscription({ plan: "pro", status: "past_due" })).toBe("free");
    expect(planFromSubscription({ plan: "enterprise", status: "active" })).toBe("free");
  });

  it("reads active and trialing paid plans", () => {
    expect(planFromSubscription(activePro)).toBe("pro");
    expect(planFromSubscription(activeBusiness)).toBe("business");
  });
});

describe("resolveEntitlements", () => {
  it("keeps the normal Free limits", () => {
    const e = resolveEntitlements(null);
    expect(e.plan).toBe("free");
    expect(e.unlimited).toBe(false);
    expect(e.limits).toEqual(FREE_LIMITS);
    expect(e.canUpgrade).toBe(true);
    expect(e.canManageBilling).toBe(false);
  });

  it("gives paid plans no commercial limits and the billing portal", () => {
    const e = resolveEntitlements(activePro);
    expect(e.plan).toBe("pro");
    expect(e.unlimited).toBe(true);
    expect(e.limits).toEqual({ contacts: null, followUps: null });
    expect(e.canUpgrade).toBe(false);
    expect(e.canManageBilling).toBe(true);
  });

  it("treats business like pro for limits", () => {
    const e = resolveEntitlements(activeBusiness);
    expect(e.plan).toBe("business");
    expect(e.unlimited).toBe(true);
  });

  it("does not let an inactive subscription change anything", () => {
    expect(resolveEntitlements({ plan: "pro", status: "canceled" }).plan).toBe("free");
  });
});
