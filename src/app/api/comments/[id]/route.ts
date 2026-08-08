import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Await cookies() for Next.js App Router compatibility
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitor_session")?.value;
    
    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentId = params.id;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || !visitor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Make role check case-insensitive (handles ADMIN, admin, Admin)
    const visitorRoleUpper = visitor.role?.toUpperCase();
    const isAdmin = visitorRoleUpper === "ADMIN";
    const isOwner = comment.visitorId === visitorId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }

    const updatedComment = await prisma.projectComment.update({
      where: { id: commentId },
      data: { content },
      include: { visitor: true },
    });

    return NextResponse.json({ success: true, comment: updatedComment });
  } catch (error) {
    console.error("Patch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    
    // DEBUG: Print all available cookies to see what the session cookie is actually named
    const allCookies = cookieStore.getAll();
    console.log("All available cookies:", allCookies);

    const visitorId = cookieStore.get("visitor_session")?.value;
    console.log("Extracted visitorId from cookie:", visitorId);

    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized: No visitor_session cookie found" }, { status: 401 });
    }

    const commentId = params.id;

    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
    });

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
    });

    console.log("Found visitor from DB:", visitor);
    console.log("Found comment from DB:", comment);

    if (!comment || !visitor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // DEBUG: Print roles to see why it's failing
    console.log("Visitor role:", visitor.role, "| Comment visitorId:", comment.visitorId, "| Current visitorId:", visitorId);

    const visitorRoleUpper = visitor.role?.toUpperCase();
    const isAdmin = visitorRoleUpper === "ADMIN" || visitorRoleUpper === "ADMINISTRATOR";
    const isOwner = comment.visitorId === visitorId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }

    await prisma.projectComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}