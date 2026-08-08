import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const visitorId = cookies().get("visitor_session")?.value;
    if (!visitorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, mobileNumber, avatarUrl, password } = body;

    // Update visitor in database
    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        mobileNumber,
        avatarUrl,
        ...(password && password.trim() !== "" ? { password } : {}), // Update password only if provided
      },
    });

    return NextResponse.json({ success: true, visitor: updatedVisitor });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}