// Remembers which paid plan a visitor picked on the pricing section, so checkout
// can start right after the account and workspace exist. Stored only in this browser.
const KEY = "octom-pending-plan";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type PaidPlan = "pro" | "business";

export function isPaidPlan(value: unknown): value is PaidPlan {
  return value === "pro" || value === "business";
}

export function setPendingPlan(plan: PaidPlan): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ plan, at: Date.now() }));
  } catch {
    // storage may be blocked; the user can still pick a plan from the Plans page
  }
}

export function getPendingPlan(): PaidPlan | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { plan, at } = parsed as { plan?: unknown; at?: unknown };
    if (!isPaidPlan(plan) || typeof at !== "number") return null;
    if (Date.now() - at > MAX_AGE_MS) return null;
    return plan;
  } catch {
    return null;
  }
}

export function clearPendingPlan(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
