import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const visitorId = cookies().get("visitor_session")?.value;
  if (!visitorId) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  const projectId = params.id;

  try {
    // Check if already liked
    const existingLike = await prisma.projectLike.findUnique({
      where: { projectId_visitorId: { projectId, visitorId } },
    });

    if (existingLike) {
      // Unlike
      await prisma.projectLike.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.projectLike.create({
        data: { projectId, visitorId },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}