import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=google_auth_failed`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/visitor/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      console.error("GOOGLE TOKEN API ERROR:", JSON.stringify(tokenData));
      throw new Error("Failed to fetch Google access token");
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      throw new Error("Google account has no email address");
    }

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

    const cookieStore = await cookies();
    cookieStore.set({
      name: "visitor_session",
      value: visitor.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.redirect(`${baseUrl}/?success=logged_in`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=server_error`);
  }
}
