// One place that decides what a workspace is allowed to do and what the
// pricing screens may offer. Everything that depends on the plan, or on
// Bootstrap Mode, reads from here instead of checking the flag itself.
//
// The server (API routes and the database) is the source of truth. The browser
// uses the same function only to decide what to show.

export type Plan = "free" | "pro" | "business";

// Must match the limits enforced by the database triggers.
export const FREE_LIMITS = { contacts: 10, followUps: 10 };

export type Entitlements = {
  /** The plan shown to the user. Existing paid subscribers keep theirs. */
  plan: Plan;
  /** True when no commercial contact/follow-up limit applies. */
  unlimited: boolean;
  /** Counts that may not be exceeded; null means no commercial limit. */
  limits: { contacts: number | null; followUps: number | null };
  /** Paid plans can be bought. False in Bootstrap Mode. */
  billingEnabled: boolean;
  canUpgrade: boolean;
  /** Existing Stripe customers can always reach the billing portal. */
  canManageBilling: boolean;
};

export type SubscriptionRow = { plan?: string | null; status?: string | null } | null | undefined;

export function planFromSubscription(sub: SubscriptionRow): Plan {
  const active = sub?.status === "active" || sub?.status === "trialing";
  const p = sub?.plan;
  return active && (p === "pro" || p === "business") ? p : "free";
}

export function resolveEntitlements(bootstrap: boolean, sub: SubscriptionRow): Entitlements {
  const plan = planFromSubscription(sub);
  const paid = plan !== "free";

  if (bootstrap) {
    return {
      plan,
      unlimited: true,
      limits: { contacts: null, followUps: null },
      billingEnabled: false,
      canUpgrade: false,
      canManageBilling: paid,
    };
  }

  return {
    plan,
    unlimited: paid,
    limits: paid
      ? { contacts: null, followUps: null }
      : { contacts: FREE_LIMITS.contacts, followUps: FREE_LIMITS.followUps },
    billingEnabled: true,
    canUpgrade: !paid,
    canManageBilling: paid,
  };
}

/** Which plan cards the pricing screens show. */
export function visiblePlans(bootstrap: boolean, current: Plan = "free"): Plan[] {
  if (!bootstrap) return ["free", "pro", "business"];
  return current === "free" ? ["free"] : ["free", current];
}
