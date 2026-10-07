// Octom runs on two addresses from one deployment:
//   octom.eu / www.octom.eu   the public site and the legal pages
//   one.octom.eu              the app, "OCTOM One" (sign in, sign up, CRM)
// proxy.ts uses these helpers to send each page to the right address.
// Redirect targets are fixed constants, never built from the request.

export const SITE_URL = "https://octom.eu";
export const APP_URL = "https://one.octom.eu";
export const APP_HOST = "one.octom.eu";
export const SITE_HOSTS = ["octom.eu", "www.octom.eu"];

// Pages that belong to the app (first path segment).
const APP_SEGMENTS = new Set([
  "dashboard", "contacts", "followups", "data", "plans", "account", "onboarding",
  "pipeline", "team", "assistant", "login", "signup", "forgot-password",
  "reset-password", "join",
]);

// Pages that belong to the public site (first path segment).
const SITE_SEGMENTS = new Set([
  "privacy", "terms", "cookies", "refunds", "accessibility", "subprocessors",
  "security", "company", "contact", "for",
]);

function segmentOf(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}

export function hostName(hostHeader: string | null | undefined): string {
  return (hostHeader ?? "").toLowerCase().split(":")[0];
}

/**
 * Where a request should be sent instead, or null to serve it here.
 * API routes, static files and every other host (localhost, preview
 * deployments) are never redirected.
 */
export function redirectTarget(host: string, pathname: string, search = ""): string | null {
  const segment = segmentOf(pathname);

  if (SITE_HOSTS.includes(host)) {
    if (APP_SEGMENTS.has(segment)) return `${APP_URL}${pathname}${search}`;
    return null;
  }

  if (host === APP_HOST) {
    if (pathname === "/") return `${APP_URL}/dashboard`;
    if (SITE_SEGMENTS.has(segment)) return `${SITE_URL}${pathname}${search}`;
    return null;
  }

  return null;
}
