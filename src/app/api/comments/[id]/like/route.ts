import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const visitorId = cookies().get("visitor_session")?.value;
    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
    if (!visitor || visitor.isReported) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const commentId = params.id;

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_visitorId: { commentId, visitorId },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.commentLike.create({
        data: { commentId, visitorId },
      });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Comment like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}