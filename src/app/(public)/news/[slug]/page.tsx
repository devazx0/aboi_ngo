import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/generated/client";

export const revalidate = 60;

const getBlogPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      return await prisma.blogPost.findFirst({
        where: {
          slug,
          status: PostStatus.PUBLISHED,
        },
        include: {
          author: { select: { name: true, email: true } },
        },
      });
    },
    [`blog-post-${slug}`],
    {
      revalidate: 60,
      tags: [`news-post-${slug}`, "news-articles"],
    }
  )();

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: PostStatus.PUBLISHED },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | ABOI NGO" };
  }

  return {
    title: `${post.title} | ABOI NGO`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="max-w-container-max mx-auto px-gutter py-xl">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container mb-md transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to News
        </Link>

        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-sm mb-sm text-on-surface-variant">
          <span className="bg-primary/10 text-primary font-label-md text-label-md px-3 py-1 rounded-full border border-primary/20">
            {post.category}
          </span>
          {publishedDate && (
            <div className="flex items-center gap-1 font-label-md text-label-md text-[13px]">
              <span className="material-symbols-outlined text-[16px]">
                calendar_today
              </span>
              <span>{publishedDate}</span>
            </div>
          )}
          {post.author?.name && (
            <div className="flex items-center gap-1 font-label-md text-label-md text-[13px]">
              <span className="material-symbols-outlined text-[16px]">
                person
              </span>
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Article Title */}
        <h1 className="font-display-lg text-display-lg text-on-surface mb-md leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg leading-relaxed border-l-4 border-primary pl-md py-1">
            {post.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-full h-[320px] md:h-[480px] rounded-xl overflow-hidden mb-xl relative bg-surface-container border border-outline-variant shadow-sm">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose max-w-none font-body-lg text-body-lg text-on-surface leading-relaxed [&_p]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-lg [&_img]:my-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer Navigation */}
        <div className="mt-xl pt-lg border-t border-outline-variant flex justify-between items-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to all news
          </Link>
        </div>
      </div>
    </article>
  );
}
