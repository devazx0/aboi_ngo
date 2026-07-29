import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuthSession } from "@/lib/auth";
import { PostStatus } from "@/generated/client";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/blog - List blog posts with search & status filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && Object.values(PostStatus).includes(status as PostStatus)) {
      where.status = status as PostStatus;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("GET /api/admin/blog Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create a new blog post
export async function POST(request: Request) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required fields." },
        { status: 400 }
      );
    }

    let baseSlug = generateSlug(title);
    if (!baseSlug) baseSlug = `post-${Date.now()}`;

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const postStatus = status === "Published" ? PostStatus.PUBLISHED : PostStatus.DRAFT;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || title.slice(0, 150),
        coverImage: coverImage || null,
        status: postStatus,
        authorId: session.userId,
        publishedAt: postStatus === PostStatus.PUBLISHED ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/blog Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create blog post." },
      { status: 500 }
    );
  }
}
