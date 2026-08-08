import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const visitorId = cookies().get("visitor_session")?.value;
    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is reported/banned from commenting
    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });

    if (!visitor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (visitor.isReported) {
      return NextResponse.json(
        { error: "you are not allowed to comment contact sevice center" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, projectId, parentId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const newComment = await prisma.projectComment.create({
      data: {
        content,
        projectId,
        visitorId,
        parentId: parentId || null, // supports threaded replies
      },
      include: {
        visitor: true,
        likes: true,
        replies: {
          include: { visitor: true, likes: true },
        },
      },
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}