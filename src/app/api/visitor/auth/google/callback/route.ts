import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=google_auth_failed`);
  }

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/visitor/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("Failed to fetch Google access token");

    // 2. Fetch user profile from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      throw new Error("Google account has no email address");
    }

    // 3. Find or create visitor in Prisma database
    let visitor = await prisma.visitor.findUnique({ where: { email: googleUser.email } });

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name || "Google",
          lastName: googleUser.family_name || "User",
          avatarUrl: googleUser.picture || null,
          authProvider: "google",
        },
      });
    }

    // 4. Set the visitor session cookie (matching your existing auth setup)
    const cookieStore = await cookies();
    cookieStore.set({
      name: "visitor_session",
      value: visitor.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?success=logged_in`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=server_error`);
  }
}
