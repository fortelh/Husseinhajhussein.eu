import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { commentId, visitorId, reason } = body;

    if (!commentId || !reason) {
      return NextResponse.json(
        { error: "Comment ID and reason are required." },
        { status: 400 }
      );
    }

    // 1. Create the comment report
    await prisma.commentReport.create({
      data: {
        commentId,
        visitorId: visitorId || null,
        reason,
        status: "pending",
      },
    });

    // 2. Hide the comment (Make sure `isHidden` exists in your Prisma schema!)
    await prisma.projectComment.update({
      where: { id: commentId },
      data: { isHidden: true },
    }).catch((err) => {
      console.error("Failed to hide comment during report:", err);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}