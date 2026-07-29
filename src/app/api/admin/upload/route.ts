import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    // 1. Verify admin session cookie
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }

    // 2. Extract file & bucket from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "posts-media";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase credentials missing on server." },
        { status: 500 }
      );
    }

    // 3. Generate unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Upload buffer to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Server Supabase Storage upload error:", error);
      let userFriendlyError = error.message;
      if (error.message?.toLowerCase().includes("row-level security") || error.message?.toLowerCase().includes("rls")) {
        userFriendlyError = `Storage RLS Policy Error: Supabase blocked the upload. Please either save the policy in Supabase Dashboard (check INSERT under Allowed Operations), or add SUPABASE_SERVICE_ROLE_KEY to your .env file.`;
      }
      return NextResponse.json({ error: userFriendlyError }, { status: 500 });
    }

    // 5. Get public viewing URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("POST /api/admin/upload Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
