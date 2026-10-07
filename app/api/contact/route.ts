import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 8_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort limit per server instance: 5 messages per IP per hour.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) {
    for (const [key, value] of hits) if (value.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

function fail(status: number, code: string) {
  return NextResponse.json({ error: code }, { status, headers: { "Cache-Control": "no-store" } });
}

function clean(value: unknown, max: number): string {
  return String(value ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail(413, "too_large");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return fail(400, "invalid");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid");
  }

  // Hidden field that real visitors never fill in. Pretend success to bots.
  if (clean(body.website, 200) !== "") {
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const name = clean(body.name, 100).replace(/\s+/g, " ");
  const email = clean(body.email, 200);
  const message = clean(body.message, 3_000);
  if (name.length < 1 || !EMAIL.test(email) || message.length < 10) {
    return fail(400, "invalid");
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return fail(429, "rate_limited");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error(
      `contact: not configured (RESEND_API_KEY ${key ? "set" : "MISSING"}, CONTACT_TO_EMAIL ${to ? "set" : "MISSING"})`
    );
    return fail(503, "not_configured");
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "OCTOM One <onboarding@resend.dev>",
        to,
        reply_to: email,
        subject: `Octom contact: ${name}`.replace(/[\r\n]/g, " ").slice(0, 150),
        // Plain text only, so nothing the visitor typed is ever treated as markup.
        text: `From: ${name} <${email}>\n\n${message}\n`,
      }),
    });
    if (!res.ok) {
      // Log the provider's reason (for example an unverified sender domain). No secrets.
      const detail = await res.text().catch(() => "");
      console.error(`contact: Resend rejected the email (${res.status}): ${detail.slice(0, 300)}`);
      return fail(502, "send_failed");
    }
  } catch (error) {
    console.error("contact: could not reach Resend", error instanceof Error ? error.message : "");
    return fail(502, "send_failed");
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
