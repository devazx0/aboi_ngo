/**
 * Central SEO / site configuration.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://aboi-ngo.org)
 * to the canonical apex domain configured in Vercel.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://aboi-ngo.org";

export const siteConfig = {
  name: "ABOI NGO",
  alternateNames: ["ONG ABOI", "NGO-ABOI", "Association Béninoise des Oeuvres Islamiques"],
  tagline:
    "Association Béninoise des Oeuvres Islamiques — Charity, Education, Health & Peace in Benin",
  description:
    "ABOI NGO (ONG ABOI) is a Benin-based charity: clean water, orphan support, education excellence, health camps and peace building. Association Béninoise des Oeuvres Islamiques.",
  locale: "en",
  ogImage: "/logo.png",
  twitterCard: "summary_large_image" as const,
};
