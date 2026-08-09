import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Dynamically extract the protocol and host from the incoming request (e.g., https://husseinhajhussein.eu)
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=linkedin_auth_failed`);
  }

  try {
    // 1. Exchange code for access token using the dynamic redirect URI
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/visitor/auth/linkedin/callback`,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("Failed to fetch LinkedIn access token");

    // 2. Fetch user profile from LinkedIn OpenID UserInfo endpoint
    const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const liUser = await userRes.json();

    const email = liUser.email;
    if (!email) {
      throw new Error("LinkedIn account has no email address");
    }

    // 3. Find or create visitor in Prisma database
    let visitor = await prisma.visitor.findUnique({ where: { email } });

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          email,
          firstName: liUser.given_name || liUser.name || "LinkedIn",
          lastName: liUser.family_name || "User",
          avatarUrl: liUser.picture || null,
          authProvider: "linkedin",
        },
      });
    }

    // 4. Set the visitor session cookie
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
    console.error("LinkedIn OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=server_error`);
  }
}
