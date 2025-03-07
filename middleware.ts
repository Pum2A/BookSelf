import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

// Definiowanie dozwolonych ścieżek dla każdej roli
const roleAccess = {
  OWNER: ["/firms", "/home"],
  CUSTOMER: ["/home", "/bookings"],
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

    // Specjalna reguła dla właściciela (OWNER może wejść do bookings/create, ale nie do bookings)
    if (role === "OWNER") {
      if (url === "/bookings") {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
      if (url.startsWith("/bookings/")) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }

    // Sprawdzanie dozwolonych ścieżek wg przypisanych allowedPaths
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
  matcher: [
    "/firms/:path*",
    "/home",
    "/bookings",
    "/bookings/:path*",
    "/admin",
  ],
};
