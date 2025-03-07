import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

const roleAccess = {
  OWNER: ["/firms", "/home"],
  CUSTOMER: ["/"], // Allows access to all paths except /firms
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

    // Handle CUSTOMER: block access to /firms
    if (role === "CUSTOMER") {
      if (url.startsWith("/firms")) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
      return NextResponse.next();
    }

    // Handle OWNER: block access to /bookings and /reservations
    if (role === "OWNER") {
      if (url.startsWith("/bookings") || url.startsWith("/reservations")) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
      const allowedPaths = roleAccess[role];
      const hasAccess = allowedPaths.some((path) => url.startsWith(path));
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
      return NextResponse.next();
    }

    // Handle ADMIN and other roles
    const allowedPaths = roleAccess[role] || [];
    const hasAccess = allowedPaths.some((path) => url.startsWith(path));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("🔴 Invalid token:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/firms/:path*",
    "/home",
    "/bookings",
    "/bookings/:path*",
    "/reservations",
    "/reservations/:path*",
    "/admin",
  ],
};
