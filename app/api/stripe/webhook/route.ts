import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { adminClient, planFromPrice, stripeClient } from "@/lib/billing";

export const runtime = "nodejs";

// Bootstrap Mode deliberately does not touch this handler: Stripe keeps
// reporting on existing subscriptions, and they stay in sync while it is ON.

function mapStatus(s: string): string | null {
  if (s === "active" || s === "trialing") return s;
  if (s === "past_due" || s === "unpaid") return "past_due";
  if (s === "canceled" || s === "incomplete_expired") return "canceled";
  return null;
}

async function sync(sub: Stripe.Subscription, orgHint?: string | null) {
  const orgId = sub.metadata?.org_id || orgHint;
  if (!orgId) return;
  const status = mapStatus(sub.status);
  if (!status) return;
  const ended = status === "canceled";
  const paid = planFromPrice(sub.items.data[0]?.price.id);
  if (!ended && !paid) return;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const end = (sub.items.data[0] as unknown as { current_period_end?: number })
    ?.current_period_end;
  const { error } = await adminClient()
    .from("subscriptions")
    .upsert(
      {
        organization_id: orgId,
        plan: ended ? "free" : paid,
        status,
        stripe_customer_id: customer,
        stripe_subscription_id: ended ? null : sub.id,
        current_period_end: end ? new Date(end * 1000).toISOString() : null,
      },
      { onConflict: "organization_id" }
    );
  if (error) throw new Error("db_write_failed");
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const body = await req.text();
  const stripe = stripeClient();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription" && typeof s.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(s.subscription);
        await sync(sub, s.client_reference_id);
      }
    } else if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await sync(event.data.object as Stripe.Subscription);
    }
  } catch {
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
