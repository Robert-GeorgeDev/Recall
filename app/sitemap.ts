import type { MetadataRoute } from "next";
import { SITE_URL, siteConfigured } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfigured) return [];
  const now = new Date();
  return ["", "/signup", "/for/freelancers", "/for/agencies", "/for/consultants", "/for/small-teams", "/privacy", "/terms", "/cookies"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));
}
