import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path = "/" } = body;

    // Extract headers from Vercel / Edge request
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const countryCode = request.headers.get("x-vercel-ip-country") || "BJ";
    const country = request.headers.get("x-vercel-ip-country-name") || "Benin";
    const continent = request.headers.get("x-vercel-ip-continent") || "Africa";

    // Hash IP address for privacy
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    await prisma.pageVisit.create({
      data: {
        path,
        ipHash,
        countryCode,
        country,
        continent,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Tracking error" }, { status: 500 });
  }
}
