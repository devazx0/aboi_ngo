import { NextResponse } from "next/server";
import { getAdminAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user: session });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}
