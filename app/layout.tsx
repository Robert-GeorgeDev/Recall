import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, siteConfigured } from "@/lib/site";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/components/language-provider";
import Consent from "@/components/consent";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: siteConfigured ? new URL(SITE_URL) : undefined,
  title: {
    default: "Octom – Know who to contact today",
    template: "%s | Octom",
  },
  description:
    "Octom is the simple CRM that tells you who to contact, when to contact them, and what to say.",
  openGraph: {
    title: "Octom – Know who to contact today",
    description:
      "A simple CRM built around follow-ups for freelancers, consultants and small teams.",
    siteName: "Octom",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#4F46E5" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Octom",
      ...(siteConfigured ? { url: SITE_URL } : {}),
    },
    {
      "@type": "SoftwareApplication",
      name: "Octom",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A simple CRM built around follow-ups for freelancers, consultants and small teams.",
      inLanguage: ["en", "ro"],
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
          <Consent />
        </LanguageProvider>
      </body>
    </html>
  );
}
