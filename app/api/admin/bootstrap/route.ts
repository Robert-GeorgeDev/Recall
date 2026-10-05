import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase-config";

export const runtime = "nodejs";

// Admin-only control for Bootstrap Mode.
//
// Authorization is enforced by the database, not here: every call runs with the
// caller's own token, the admin check is public.is_platform_admin(), and the
// write goes through public.set_bootstrap_mode(), which checks again and writes
// the audit row. This route only turns database refusals into HTTP errors.
// Nothing in the request body can change who the caller is.

const noStore = { "Cache-Control": "no-store" };

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: noStore });
}

function userClient(req: Request): SupabaseClient | null {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function readState(sb: SupabaseClient) {
  const { data, error } = await sb
    .from("app_settings")
    .select("value, updated_at, updated_by")
    .eq("key", "bootstrap_mode")
    .maybeSingle();
  if (error) return null;
  return {
    enabled: data?.value === true,
    updatedAt: (data?.updated_at as string | undefined) ?? null,
    updatedBy: (data?.updated_by as string | undefined) ?? null,
  };
}

export async function GET(req: Request) {
  const sb = userClient(req);
  if (!sb) return fail(403, "forbidden");
  const { data: isAdmin, error } = await sb.rpc("is_platform_admin");
  if (error || isAdmin !== true) return fail(403, "forbidden");

  const state = await readState(sb);
  if (!state) return fail(500, "server_error");
  return NextResponse.json(state, { headers: noStore });
}

export async function POST(req: Request) {
  const sb = userClient(req);
  if (!sb) return fail(403, "forbidden");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "bad_request");
  }
  const enabled = (body as { enabled?: unknown } | null)?.enabled;
  if (typeof enabled !== "boolean") return fail(400, "bad_request");

  const { error } = await sb.rpc("set_bootstrap_mode", { enabled });
  if (error) {
    if (error.code === "42501") return fail(403, "forbidden");
    return fail(500, "server_error");
  }

  const state = await readState(sb);
  if (!state) return fail(500, "server_error");
  return NextResponse.json(state, { headers: noStore });
}
