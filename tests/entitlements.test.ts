import { describe, expect, it } from "vitest";
import {
  FREE_LIMITS,
  planFromSubscription,
  resolveEntitlements,
  visiblePlans,
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

describe("resolveEntitlements, Bootstrap Mode OFF", () => {
  it("keeps the normal Free limits", () => {
    const e = resolveEntitlements(false, null);
    expect(e.plan).toBe("free");
    expect(e.unlimited).toBe(false);
    expect(e.limits).toEqual(FREE_LIMITS);
    expect(e.billingEnabled).toBe(true);
    expect(e.canUpgrade).toBe(true);
    expect(e.canManageBilling).toBe(false);
  });

  it("gives paid plans no commercial limits and the billing portal", () => {
    const e = resolveEntitlements(false, activePro);
    expect(e.plan).toBe("pro");
    expect(e.unlimited).toBe(true);
    expect(e.limits).toEqual({ contacts: null, followUps: null });
    expect(e.canUpgrade).toBe(false);
    expect(e.canManageBilling).toBe(true);
  });
});

describe("resolveEntitlements, Bootstrap Mode ON", () => {
  it("makes Free the effective plan with no commercial limits", () => {
    const e = resolveEntitlements(true, null);
    expect(e.plan).toBe("free");
    expect(e.unlimited).toBe(true);
    expect(e.limits).toEqual({ contacts: null, followUps: null });
    expect(e.billingEnabled).toBe(false);
    expect(e.canUpgrade).toBe(false);
    expect(e.canManageBilling).toBe(false);
  });

  it("does not let an inactive or unknown subscription change anything", () => {
    expect(resolveEntitlements(true, { plan: "pro", status: "canceled" }).plan).toBe("free");
  });

  it("leaves existing subscribers on their plan and lets them manage billing", () => {
    const e = resolveEntitlements(true, activeBusiness);
    expect(e.plan).toBe("business");
    expect(e.unlimited).toBe(true);
    expect(e.canUpgrade).toBe(false);
    expect(e.canManageBilling).toBe(true);
  });
});

describe("visiblePlans", () => {
  it("shows all three plans when monetization is on", () => {
    expect(visiblePlans(false)).toEqual(["free", "pro", "business"]);
    expect(visiblePlans(false, "pro")).toEqual(["free", "pro", "business"]);
  });

  it("shows only Free in Bootstrap Mode", () => {
    expect(visiblePlans(true)).toEqual(["free"]);
    expect(visiblePlans(true, "free")).toEqual(["free"]);
  });

  it("also shows the plan an existing subscriber is on, but never offers the others", () => {
    expect(visiblePlans(true, "pro")).toEqual(["free", "pro"]);
    expect(visiblePlans(true, "business")).toEqual(["free", "business"]);
  });
});
