import { NextResponse } from "next/server";
import { adminClient, authorize, originOf, priceFor, stripeClient } from "@/lib/billing";
import { BOOTSTRAP_BLOCKED_MESSAGE, getBootstrapMode } from "@/lib/bootstrap";

export async function POST(req: Request) {
  let body: { orgId?: string; plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { orgId, plan } = body;
  if (!orgId || (plan !== "pro" && plan !== "business")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    // Bootstrap Mode: no new paid subscriptions. Checked on the server, from the
    // database, every time. If the setting cannot be read this fails closed.
    if (await getBootstrapMode()) {
      return NextResponse.json(
        { error: "bootstrap_mode", message: BOOTSTRAP_BLOCKED_MESSAGE },
        { status: 403 }
      );
    }
    const user = await authorize(req, orgId);
    if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const price = priceFor(plan);
    if (!price) return NextResponse.json({ error: "not_configured" }, { status: 500 });

    const admin = adminClient();
    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id, status")
      .eq("organization_id", orgId)
      .maybeSingle();
    if (sub?.stripe_subscription_id && sub.status !== "canceled") {
      return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
    }
    const origin = originOf(req);
    const session = await stripeClient().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      ...(sub?.stripe_customer_id
        ? { customer: sub.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      client_reference_id: orgId,
      metadata: { org_id: orgId },
      subscription_data: { metadata: { org_id: orgId } },
      allow_promotion_codes: true,
      success_url: `${origin}/plans?checkout=success`,
      cancel_url: `${origin}/plans?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
