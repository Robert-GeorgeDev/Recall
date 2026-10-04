import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { SUPABASE_URL } from "@/lib/supabase-config";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("stripe_not_configured");
  return new Stripe(key);
}

export function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("service_key_missing");
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

export function priceFor(plan: string): string | undefined {
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS;
  return undefined;
}

export function planFromPrice(priceId?: string): "pro" | "business" | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
  return null;
}

// Only owners and admins of the workspace may manage billing.
export async function authorize(req: Request, orgId: string) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const admin = adminClient();
  const { data } = await admin.auth.getUser(token);
  const user = data.user;
  if (!user) return null;
  const { data: m } = await admin
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!m || !["owner", "admin"].includes(m.role)) return null;
  return user;
}

export function originOf(req: Request) {
  return process.env.APP_URL || new URL(req.url).origin;
}
