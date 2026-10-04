import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, siteConfigured } from "@/lib/site";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/components/language-provider";

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
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
