import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "aboi_ngo_super_secret_admin_jwt_key_2026_x98f23";
const secret = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Next.js 16 Proxy network-boundary request interceptor (src/proxy.ts).
 * Restricts access to all /admin and /api/admin routes except unauthenticated login endpoints.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets and non-admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // 2. Allow login routes without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/auth/login") {
    return NextResponse.next();
  }

  // 3. Extract admin session cookie
  const token = request.cookies.get("admin_session")?.value;

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized access. Admin authentication required." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Verify JWT token signature and expiration
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Session expired or invalid token. Please log in again." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
