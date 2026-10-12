import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { localeDirections } from "@/utils/locale";
import { QueryProvider } from "@/service/QueryProvider";
import { siteUrl, siteConfig } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ABOI NGO | ONG ABOI — Charity, Education & Peace in Benin",
    template: "%s | ABOI NGO — ONG ABOI",
  },
  description: siteConfig.description,
  keywords: [
    "ABOI NGO",
    "ONG ABOI",
    "NGO-ABOI",
    "Association Béninoise des Oeuvres Islamiques",
    "NGO Benin",
    "ONG Bénin",
    "charity Benin",
    "Islamic charity Benin",
    "Cotonou NGO",
    "clean water Benin",
    "orphan support Benin",
    "education Benin",
    "waqf Benin",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_AR"],
    url: "/",
    siteName: "ABOI NGO — ONG ABOI",
    title: "ABOI NGO | ONG ABOI — Charity, Education & Peace in Benin",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "ABOI NGO — ONG ABOI logo" }],
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: "ABOI NGO | ONG ABOI — Charity, Education & Peace in Benin",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Set GOOGLE_SITE_VERIFICATION in Vercel env (GSC HTML-tag method).
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = localeDirections[locale as keyof typeof localeDirections] || "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased light`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
