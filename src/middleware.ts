import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("admin_session");

  // 1. Protect routes starting with /admin (excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // ⏱️ Sliding 2-minute inactivity window:
    // Clone response and refresh the cookie's maxAge to 120 seconds on every admin action/request
    const response = NextResponse.next();
    response.cookies.set({
      name: "admin_session",
      value: sessionCookie.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 120, // 2 minutes in seconds
    });
    return response;
  }

  // 2. If already logged in and trying to access the login page, redirect to dashboard
  if (pathname === "/admin/login") {
    if (sessionCookie && sessionCookie.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};