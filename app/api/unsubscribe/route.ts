import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase-config";

export const dynamic = "force-dynamic";

const TOKEN = /^[a-f0-9]{32,64}$/;

function page(body: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Neximo</title></head><body style="font-family:Arial,sans-serif;max-width:420px;margin:15vh auto;padding:0 20px;color:#0F172A">${body}</body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function tokenOf(request: Request) {
  const t = new URL(request.url).searchParams.get("token") ?? "";
  return TOKEN.test(t) ? t : null;
}

export async function GET(request: Request) {
  const token = tokenOf(request);
  if (!token) return page("<h1>Invalid link</h1>", 400);
  return page(
    `<h1>Unsubscribe</h1><p>Stop the daily summary email?</p><form method="post" action="/api/unsubscribe?token=${token}"><button style="background:#4F46E5;color:#fff;border:0;padding:12px 18px;border-radius:10px;font-size:16px">Unsubscribe</button></form>`
  );
}

export async function POST(request: Request) {
  const token = tokenOf(request);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token) return page("<h1>Invalid link</h1>", 400);
  if (!serviceKey) return page("<h1>Something went wrong</h1>", 500);

  const admin = createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false } });
  const { error } = await admin
    .from("email_preferences")
    .update({ daily_summary: false })
    .eq("unsubscribe_token", token);
  if (error) return page("<h1>Something went wrong</h1>", 500);
  return page("<h1>You are unsubscribed</h1><p>You will not get the daily summary anymore.</p>");
}
