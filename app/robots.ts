import type { MetadataRoute } from "next";
import { SITE_URL, siteConfigured } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/contacts",
        "/followups",
        "/data",
        "/plans",
        "/admin",
        "/account",
        "/onboarding",
        "/pipeline",
        "/team",
        "/assistant",
        "/join",
      ],
    },
    ...(siteConfigured ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
