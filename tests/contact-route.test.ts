import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

let ipCounter = 0;
function request(body: unknown, ip?: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip ?? `10.0.0.${++ipCounter}` },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = { name: "Ana", email: "ana@example.com", message: "Hello, I have a question." };

describe("contact route", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
  });

  it("rejects bodies that are too large", async () => {
    const res = await POST(request({ ...valid, message: "x".repeat(9000) }));
    expect(res.status).toBe(413);
  });

  it("rejects invalid JSON and invalid fields", async () => {
    expect((await POST(request("not json"))).status).toBe(400);
    expect((await POST(request({ ...valid, email: "nope" }))).status).toBe(400);
    expect((await POST(request({ ...valid, message: "short" }))).status).toBe(400);
    expect((await POST(request({ ...valid, name: "  " }))).status).toBe(400);
  });

  it("pretends success to bots and sends nothing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(request({ ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers 503 when email is not configured", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
  });

  it("sends a plain-text email with reply_to and a clean subject", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(request({ ...valid, name: "Ana\r\nBcc: evil@example.com" }));
    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sent.to).toBe("owner@example.com");
    expect(sent.reply_to).toBe("ana@example.com");
    expect(sent.subject).not.toMatch(/[\r\n]/);
    expect(sent.html).toBeUndefined();
  });

  it("answers 502 when the email provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const res = await POST(request(valid));
    expect(res.status).toBe(502);
  });

  it("limits repeated messages from one address", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const ip = "192.0.2.77";
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) statuses.push((await POST(request(valid, ip))).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
    expect(statuses[6]).toBe(429);
  });
});
