import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/generated/client";
import { NewsPageClient } from "./NewsPageClient";

export const revalidate = 60;

const getPublishedNewsArticles = unstable_cache(
  async () => {
    const posts = await prisma.blogPost.findMany({
      where: { status: PostStatus.PUBLISHED },
      include: {
        author: { select: { name: true, email: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 200),
      imageUrl: post.coverImage || "",
      imageAlt: post.title,
      category: post.category,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
    }));
  },
  ["news-published-articles"],
  {
    revalidate: 60,
    tags: ["news-articles"],
  }
);

export default async function NewsPage() {
  const articles = await getPublishedNewsArticles();

  return <NewsPageClient articles={articles} />;
}

