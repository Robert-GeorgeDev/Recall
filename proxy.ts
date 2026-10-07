import { NextResponse, type NextRequest } from "next/server";
import { APP_HOST, hostName, redirectTarget } from "@/lib/hosts";

// Sends each page to its own address (public site vs. the OCTOM One app).
export function proxy(req: NextRequest) {
  const host = hostName(req.headers.get("host"));
  const target = redirectTarget(host, req.nextUrl.pathname, req.nextUrl.search);
  if (target) return NextResponse.redirect(target, 308);

  const res = NextResponse.next();
  // The app is for signed-in people, not for search engines.
  if (host === APP_HOST) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
