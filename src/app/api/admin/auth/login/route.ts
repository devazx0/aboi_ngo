import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAdminAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    // Set HTTP-Only Cookie Session
    await setAdminAuthCookie({
      userId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Unable to connect to database service. Please check database connection or try again later." },
      { status: 500 }
    );
  }
}
