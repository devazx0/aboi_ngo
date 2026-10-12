import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/generated/client";
import { siteUrl } from "@/lib/site";

const staticRoutes = ["", "/about", "/pillars", "/news", "/contact", "/donate"];

/**
 * Powers https://<domain>/sitemap.xml — the file you submit in
 * Google Search Console so "aboi ngo" / "ong aboi" pages get discovered.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/news" ? 0.9 : 0.8,
  }));

  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: PostStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      take: 500,
    });

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/news/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticEntries, ...postEntries];
  } catch {
    // Build must not fail if the DB is unreachable (e.g. preview builds).
    return staticEntries;
  }
}
