import { NextResponse } from "next/server";
import { adminClient, stripeClient } from "@/lib/billing";

export const runtime = "nodejs";

// Deletes the signed-in user's account. Before the database cleanup runs, any
// paid subscription of the workspaces being deleted is cancelled in Stripe, so a
// deleted account is never billed again.
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const admin = adminClient();
    const { data } = await admin.auth.getUser(token);
    const user = data.user;
    if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

    // Same rule as the database function: every workspace the user belongs to
    // must have no other members, otherwise nothing is cancelled or deleted.
    const { data: mine } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id);
    const orgIds = (mine ?? []).map((r) => r.organization_id as string);

    if (orgIds.length > 0) {
      const { data: members } = await admin
        .from("organization_members")
        .select("organization_id, user_id")
        .in("organization_id", orgIds);
      if ((members ?? []).some((m) => m.user_id !== user.id)) {
        return NextResponse.json({ error: "members_exist" }, { status: 409 });
      }

      const { data: subs } = await admin
        .from("subscriptions")
        .select("stripe_subscription_id")
        .in("organization_id", orgIds)
        .not("stripe_subscription_id", "is", null);

      for (const s of subs ?? []) {
        const id = s.stripe_subscription_id as string;
        try {
          await stripeClient().subscriptions.cancel(id);
        } catch (e) {
          const code = (e as { code?: string }).code;
          // Already gone on Stripe's side is fine; anything else stops deletion.
          if (code !== "resource_missing") {
            return NextResponse.json({ error: "billing_cancel_failed" }, { status: 502 });
          }
        }
      }
    }

    // The database function can only be run with the service key, never by a
    // signed-in user directly, so Stripe cancellation above cannot be skipped.
    // The id comes from the verified token, never from the request.
    const { error } = await admin.rpc("delete_account_for", { target: user.id });
    if (error) {
      return NextResponse.json(
        { error: String(error.message).includes("members_exist") ? "members_exist" : "server_error" },
        { status: String(error.message).includes("members_exist") ? 409 : 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
