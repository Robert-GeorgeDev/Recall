// The public website address (no trailing slash). The sitemap and canonical
// links use it. Leave a "[" in it to turn those off.
import { SITE_URL as HOSTS_SITE_URL } from "@/lib/hosts";

export const SITE_URL = HOSTS_SITE_URL;

export const siteConfigured = !SITE_URL.includes("[");
