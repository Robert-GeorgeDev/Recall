import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL, siteConfigured } from "@/lib/site";
import { APP_HOST, hostName } from "@/lib/hosts";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = hostName((await headers()).get("host"));

  // The app (one.octom.eu) is for signed-in people, not for search engines.
  if (host === APP_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    ...(siteConfigured ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
