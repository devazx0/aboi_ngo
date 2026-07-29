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

// GET /api/admin/media/[id] - Fetch single media item details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;

    const mediaItem = await prisma.mediaItem.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!mediaItem) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    return NextResponse.json({ item: mediaItem });
  } catch (error: any) {
    console.error("GET /api/admin/media/[id] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch media item." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/media/[id] - Update media item metadata (altText, caption, filename)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { altText, caption, filename } = body;

    const dataToUpdate: any = {};
    if (typeof altText === "string") dataToUpdate.altText = altText;
    if (typeof caption === "string") dataToUpdate.caption = caption;
    if (typeof filename === "string" && filename.trim()) dataToUpdate.filename = filename.trim();

    const updatedItem = await prisma.mediaItem.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error: any) {
    console.error("PATCH /api/admin/media/[id] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update media item." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/media/[id] - Delete single media item (removes from Supabase Storage & DB)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.mediaItem.findUnique({
      where: { id },
      select: { id: true, filePath: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    // 1. Delete physical file from Supabase Storage
    if (item.filePath) {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("posts-media")
          .remove([item.filePath]);

        if (storageError) {
          console.warn("Warning: Supabase file remove failed:", storageError);
        }
      }
    }

    // 2. Delete database record
    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Media item successfully deleted from gallery and storage.",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/media/[id] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete media item." },
      { status: 500 }
    );
  }
}
