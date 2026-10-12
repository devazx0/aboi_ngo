import { siteUrl, siteConfig } from "@/lib/site";

/**
 * JSON-LD structured data — this is what lets Google show
 * "ABOI NGO / ONG ABOI" as an Organization (knowledge panel eligible)
 * instead of just a blue link.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${siteUrl}/#organization`,
    name: "ABOI NGO",
    alternateName: siteConfig.alternateNames,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    areaServed: {
      "@type": "Country",
      name: "Benin",
      alternateName: "Bénin",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cotonou",
      addressCountry: "BJ",
    },
    nonprofitStatus: "NonprofitType",
    sameAs: [] as string[],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: "ABOI NGO — ONG ABOI",
    alternateName: ["ONG ABOI", "NGO-ABOI"],
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "fr", "ar"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified: string;
  authorName?: string | null;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url: `${siteUrl}/news/${slug}`,
    image: image ? [image] : undefined,
    datePublished: datePublished || dateModified,
    dateModified,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@id": `${siteUrl}/#organization` },
    publisher: {
      "@type": "NGO",
      name: "ABOI NGO",
      alternateName: "ONG ABOI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/news/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
