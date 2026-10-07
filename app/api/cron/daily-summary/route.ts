import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase-config";
import { APP_URL } from "@/lib/hosts";

export const dynamic = "force-dynamic";

type C = { first_name: string; last_name: string; company: string };
type Row = { due_date: string; due_time: string | null; note: string; contacts: C | C[] | null };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function nameOf(r: Row) {
  const c = Array.isArray(r.contacts) ? r.contacts[0] : r.contacts;
  if (!c) return "Contact";
  return `${c.first_name} ${c.last_name}`.trim() + (c.company ? ` (${c.company})` : "");
}

function baseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  return APP_URL;
}

function build(rows: Row[], today: string, base: string, token: string) {
  const overdue = rows.filter((r) => r.due_date < today);
  const due = rows.filter((r) => r.due_date === today);
  const unsub = `${base}/api/unsubscribe?token=${token}`;
  const li = (r: Row) =>
    `<li style="margin:0 0 8px"><strong>${esc(nameOf(r))}</strong>${r.note ? ` &mdash; ${esc(r.note)}` : ""}</li>`;
  const block = (title: string, items: Row[]) =>
    items.length ? `<h2 style="font-size:16px;margin:20px 0 8px">${title}</h2><ul style="padding-left:18px;margin:0">${items.map(li).join("")}</ul>` : "";
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#0F172A">
<p style="margin:0 0 20px;font-size:24px;font-weight:700;letter-spacing:-0.5px;color:#111827">octom <span style="color:#4F46E5">One</span></p>
<h1 style="font-size:20px">Who to contact today</h1>
${block("Overdue", overdue)}${block("Due today", due)}
<p style="margin:24px 0"><a href="${base}/dashboard" style="background:#4F46E5;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none">Open OCTOM One</a></p>
<p style="font-size:12px;color:#64748B">You get this because you turned on the daily summary. <a href="${unsub}">Unsubscribe</a></p></div>`;
  const line = (r: Row) => `- ${nameOf(r)}${r.note ? `: ${r.note}` : ""}`;
  const text = [
    "Who to contact today",
    overdue.length ? `\nOverdue:\n${overdue.map(line).join("\n")}` : "",
    due.length ? `\nDue today:\n${due.map(line).join("\n")}` : "",
    `\nOpen OCTOM One: ${base}/dashboard`,
    `Unsubscribe: ${unsub}`,
  ].join("\n");
  return { subject: `Your follow-ups for today (${rows.length})`, html, text, unsub };
}

function sameSecret(given: string | null, secret: string): boolean {
  const a = Buffer.from(given ?? "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !sameSecret(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const base = baseUrl();
  if (!serviceKey || !resendKey || !base) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const from = process.env.EMAIL_FROM ?? "OCTOM One <onboarding@resend.dev>";
  const admin = createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false } });
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Bucharest" });

  const { data: prefs, error } = await admin
    .from("email_preferences")
    .select("user_id, unsubscribe_token")
    .eq("daily_summary", true)
    .limit(200);
  if (error) return NextResponse.json({ error: "prefs_failed" }, { status: 500 });

  let sent = 0, skipped = 0, failed = 0;
  for (const p of prefs ?? []) {
    const { data: member } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", p.user_id)
      .limit(1)
      .maybeSingle();
    if (!member) { skipped++; continue; }

    const { data: items } = await admin
      .from("follow_ups")
      .select("due_date, due_time, note, contacts!follow_ups_contact_fk(first_name, last_name, company)")
      .eq("organization_id", member.organization_id)
      .eq("status", "open")
      .lte("due_date", today)
      .or(`assigned_to.eq.${p.user_id},assigned_to.is.null`)
      .order("due_date")
      .limit(50);
    const rows = (items ?? []) as unknown as Row[];
    if (rows.length === 0) { skipped++; continue; }

    const { data: u } = await admin.auth.admin.getUserById(p.user_id);
    const to = u?.user?.email;
    if (!to) { skipped++; continue; }

    if (dry) { sent++; continue; }

    const mail = build(rows, today, base, p.unsubscribe_token);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: {
          "List-Unsubscribe": `<${mail.unsub}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (res.ok) sent++; else failed++;
    await new Promise((r) => setTimeout(r, 600));
  }

  return NextResponse.json({ dry, today, [dry ? "would_send" : "sent"]: sent, skipped, failed });
}
