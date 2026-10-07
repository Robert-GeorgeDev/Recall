import { describe, expect, it } from "vitest";
import { APP_URL, SITE_URL, hostName, redirectTarget } from "@/lib/hosts";

describe("hostName", () => {
  it("lowercases and drops the port", () => {
    expect(hostName("One.Octom.eu:443")).toBe("one.octom.eu");
    expect(hostName(null)).toBe("");
  });
});

describe("public site host", () => {
  it.each(["octom.eu", "www.octom.eu"])("%s sends app and sign-in pages to the app", (host) => {
    expect(redirectTarget(host, "/login")).toBe(`${APP_URL}/login`);
    expect(redirectTarget(host, "/signup", "?plan=pro")).toBe(`${APP_URL}/signup?plan=pro`);
    expect(redirectTarget(host, "/reset-password", "?token_hash=abc&type=recovery")).toBe(
      `${APP_URL}/reset-password?token_hash=abc&type=recovery`
    );
    expect(redirectTarget(host, "/join", "?token=t")).toBe(`${APP_URL}/join?token=t`);
    expect(redirectTarget(host, "/contacts/123")).toBe(`${APP_URL}/contacts/123`);
    expect(redirectTarget(host, "/dashboard")).toBe(`${APP_URL}/dashboard`);
  });

  it("keeps the public pages, the API and static files", () => {
    for (const path of ["/", "/privacy", "/terms", "/contact", "/for/freelancers", "/api/contact", "/api/stripe/webhook", "/sitemap.xml", "/.well-known/security.txt"]) {
      expect(redirectTarget("www.octom.eu", path)).toBeNull();
    }
  });

  it("does not confuse /contact (site) with /contacts (app)", () => {
    expect(redirectTarget("octom.eu", "/contact")).toBeNull();
    expect(redirectTarget("octom.eu", "/contacts")).toBe(`${APP_URL}/contacts`);
  });
});

describe("app host", () => {
  const host = "one.octom.eu";

  it("opens the dashboard at the root", () => {
    expect(redirectTarget(host, "/")).toBe(`${APP_URL}/dashboard`);
  });

  it("sends the public pages back to the site", () => {
    expect(redirectTarget(host, "/privacy")).toBe(`${SITE_URL}/privacy`);
    expect(redirectTarget(host, "/for/agencies")).toBe(`${SITE_URL}/for/agencies`);
    expect(redirectTarget(host, "/contact")).toBe(`${SITE_URL}/contact`);
  });

  it("serves the app, the API and static files", () => {
    for (const path of ["/login", "/dashboard", "/contacts", "/join", "/reset-password", "/api/ai", "/api/unsubscribe", "/manifest.webmanifest"]) {
      expect(redirectTarget(host, path)).toBeNull();
    }
  });
});

describe("other hosts", () => {
  it.each(["localhost", "octom-git-main.vercel.app", "evil.example"])("%s is never redirected", (host) => {
    expect(redirectTarget(host, "/login")).toBeNull();
    expect(redirectTarget(host, "/")).toBeNull();
    expect(redirectTarget(host, "/privacy")).toBeNull();
  });
});
