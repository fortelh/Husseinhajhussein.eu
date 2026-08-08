import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://www.linkedin.com/oauth/v2/authorization";
  const options = {
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/visitor/auth/linkedin/callback`,
    scope: "openid profile email",
  };

  const qs = new URLSearchParams(options);
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}