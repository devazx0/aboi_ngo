import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Tells Google/Bing what to crawl.
 * Admin + API routes stay out of the index; everything public is allowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
