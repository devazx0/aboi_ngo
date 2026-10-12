import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <AnalyticsTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

