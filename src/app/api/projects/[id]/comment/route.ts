import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitor_session")?.value;
    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
    
    // Only block if isReported is explicitly true, and allow admins even if something is flagged
    if (!visitor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isAdmin = visitor.role?.toUpperCase() === "ADMIN";
    if (visitor.isReported && !isAdmin) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const projectId = params.id;
    const body = await request.json();
    const { content, parentId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const comment = await prisma.projectComment.create({
      data: {
        content,
        projectId,
        visitorId,
        parentId: parentId || null,
      },
      include: {
        visitor: true,
        likes: true,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}