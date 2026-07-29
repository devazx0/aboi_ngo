import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuthSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/media - Paginated list of media items with search & filters
export async function GET(request: Request) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const typeFilter = searchParams.get("type") || "all"; // 'all' | 'image' | 'video' | 'document'
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "24", 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
        { caption: { contains: search, mode: "insensitive" } },
      ];
    }

    if (typeFilter === "image") {
      where.mimeType = { startsWith: "image/" };
    } else if (typeFilter === "video") {
      where.mimeType = { startsWith: "video/" };
    } else if (typeFilter === "document") {
      where.AND = [
        { mimeType: { notStartsWith: "image/" } },
        { mimeType: { notStartsWith: "video/" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          uploadedBy: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.mediaItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error("GET /api/admin/media Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch media items." },
      { status: 500 }
    );
  }
}

// POST /api/admin/media - Upload new media item(s)
export async function POST(request: Request) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase credentials missing on server." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const bucket = (formData.get("bucket") as string) || "posts-media";
    
    // Support multiple files under "files" or single under "file"
    const files: File[] = [];
    const rawFiles = formData.getAll("files") as File[];
    if (rawFiles.length > 0) {
      files.push(...rawFiles.filter((f) => f instanceof File && f.size > 0));
    }
    const singleFile = formData.get("file") as File | null;
    if (singleFile && singleFile instanceof File && singleFile.size > 0 && !files.includes(singleFile)) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }

    const createdItems = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop() || "bin";
      const sanitizedBaseName = file.name
        .substring(0, file.name.lastIndexOf("."))
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `${Date.now()}-${sanitizedBaseName}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data: storageData, error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        throw new Error(`Storage Error (${file.name}): ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(storageData.path);

      const mediaItem = await prisma.mediaItem.create({
        data: {
          filename: file.name,
          filePath: storageData.path,
          url: publicUrlData.publicUrl,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          altText: sanitizedBaseName.replace(/_/g, " "),
          uploadedById: session.userId,
        },
      });

      createdItems.push(mediaItem);
    }

    return NextResponse.json(
      { success: true, items: createdItems, item: createdItems[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/media Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload media files." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/media - Bulk delete media items (removes from Supabase Storage & DB)
export async function DELETE(request: Request) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid parameters. Array of 'ids' is required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase credentials missing on server." },
        { status: 500 }
      );
    }

    // 1. Fetch media items to get filePaths for bucket deletion
    const itemsToDelete = await prisma.mediaItem.findMany({
      where: { id: { in: ids } },
      select: { id: true, filePath: true },
    });

    if (itemsToDelete.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No items found to delete." });
    }

    const filePaths = itemsToDelete.map((item) => item.filePath).filter(Boolean);

    // 2. Delete physical files from Supabase Storage
    if (filePaths.length > 0) {
      const { error: storageDeleteError } = await supabaseAdmin.storage
        .from("posts-media")
        .remove(filePaths);

      if (storageDeleteError) {
        console.warn("Warning: Could not remove physical files from Supabase storage:", storageDeleteError);
      }
    }

    // 3. Delete database records
    const deleteResult = await prisma.mediaItem.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({
      success: true,
      count: deleteResult.count,
      message: `Successfully deleted ${deleteResult.count} media item(s) from gallery and storage.`,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/media Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete media items." },
      { status: 500 }
    );
  }
}
