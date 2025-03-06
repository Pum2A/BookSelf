import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

// Definiowanie dozwolonych ścieżek dla każdej roli
const roleAccess = {
  OWNER: ["/firms", "/home"],
  CUSTOMER: ["/firms", "/home", "/bookings"],
  ADMIN: ["/firms", "/home", "/bookings", "/admin"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as keyof typeof roleAccess;
    const url = request.nextUrl.pathname;

    // Sprawdzanie, czy użytkownik ma dostęp do danej ścieżki
    const allowedPaths = roleAccess[role] || [];
    const hasAccess = allowedPaths.some((path) => url.startsWith(path));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("🔴 Nieprawidłowy token:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/firms/:path*", "/home", "/bookings", "/admin"],
};
