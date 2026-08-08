import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const visitorId = cookies().get("visitor_session")?.value;
  const adminCheck = await prisma.visitor.findUnique({ where: { id: visitorId } });
  if (adminCheck?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { firstName, lastName, mobileNumber, password, isReported, role } = await request.json();

  const updateData: any = { firstName, lastName, mobileNumber, isReported, role };
  if (password && password.trim() !== "") {
    updateData.password = password; // Hash password here if you are using hashing (e.g. bcrypt)
  }

  const updated = await prisma.visitor.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}