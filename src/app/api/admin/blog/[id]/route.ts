import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuthSession } from "@/lib/auth";
import { PostStatus } from "@/generated/client";

// GET /api/admin/blog/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch post details." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/[id] - Update blog post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, coverImage, category, status } = body;

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const postStatus = status === "Published" ? PostStatus.PUBLISHED : PostStatus.DRAFT;
    const isPublishingNow =
      postStatus === PostStatus.PUBLISHED && !existingPost.publishedAt;
    const wasPublished = existingPost.status === PostStatus.PUBLISHED;

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title ?? existingPost.title,
        content: content ?? existingPost.content,
        excerpt: excerpt ?? existingPost.excerpt,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        category: category ?? existingPost.category,
        status: postStatus,
        publishedAt: isPublishingNow ? new Date() : existingPost.publishedAt,
      },
    });

    if (postStatus === PostStatus.PUBLISHED || wasPublished) {
      revalidateTag("news-articles", "max");
      revalidateTag(`news-post-${updatedPost.slug}`, "max");
      revalidatePath("/news", "page");
      revalidatePath(`/news/${updatedPost.slug}`, "page");
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("PUT /api/admin/blog/[id] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update blog post." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.delete({ where: { id } });

    if (existingPost?.status === PostStatus.PUBLISHED) {
      revalidateTag("news-articles", "max");
      revalidateTag(`news-post-${existingPost.slug}`, "max");
      revalidatePath("/news", "page");
      revalidatePath(`/news/${existingPost.slug}`, "page");
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (error: any) {
    console.error("DELETE /api/admin/blog/[id] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete post." },
      { status: 500 }
    );
  }
}
