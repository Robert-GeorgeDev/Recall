// One place that decides what a workspace is allowed to do and what the
// pricing screens may offer. Everything that depends on
// the plan, reads from here.
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

export function resolveEntitlements(sub: SubscriptionRow): Entitlements {
  const plan = planFromSubscription(sub);
  const paid = plan !== "free";

  return {
    plan,
    unlimited: paid,
    limits: paid
      ? { contacts: null, followUps: null }
      : { contacts: FREE_LIMITS.contacts, followUps: FREE_LIMITS.followUps },
    canUpgrade: !paid,
    canManageBilling: paid,
  };
}
