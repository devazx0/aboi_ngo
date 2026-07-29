import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "aboi_ngo_super_secret_admin_jwt_key_2026_x98f23";
const secret = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AdminJWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Hashes a plain text password with bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifies a plain text password against a hash.
 */
export async function verifyPassword(
  plainText: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Signs a JWT token containing admin user data.
 */
export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Verifies and decodes a JWT token.
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the HTTP-Only cookie for an authenticated admin session.
 */
export async function setAdminAuthCookie(payload: AdminJWTPayload): Promise<void> {
  const token = await signAdminToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clears the HTTP-Only admin session cookie.
 */
export async function clearAdminAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Gets and verifies the current admin session from HTTP-Only cookie.
 */
export async function getAdminAuthSession(): Promise<AdminJWTPayload | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie?.value) return null;
  return verifyAdminToken(tokenCookie.value);
}
