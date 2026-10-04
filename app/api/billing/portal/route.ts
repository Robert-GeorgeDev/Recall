import { NextResponse } from "next/server";
import { adminClient, authorize, originOf, stripeClient } from "@/lib/billing";

export async function POST(req: Request) {
  let body: { orgId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const { orgId } = body;
  if (!orgId) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  try {
    const user = await authorize(req, orgId);
    if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const { data: sub } = await adminClient()
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", orgId)
      .maybeSingle();
    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: "no_customer" }, { status: 404 });
    }
    const session = await stripeClient().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${originOf(req)}/plans`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
