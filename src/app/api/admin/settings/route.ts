import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminAuthSession } from "@/lib/auth";

// GET /api/admin/settings
export async function GET() {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    for (const s of settingsList) {
      settings[s.key] = s.value;
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings
export async function PUT(request: Request) {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings object." }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
