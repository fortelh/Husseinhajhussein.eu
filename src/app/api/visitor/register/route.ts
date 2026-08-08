import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, dateOfBirth, mobileNumber } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const existingVisitor = await prisma.visitor.findUnique({ where: { email } });
    if (existingVisitor) {
      return NextResponse.json({ error: "Email already registered. Please sign in." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVisitor = await prisma.visitor.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        mobileNumber,
        authProvider: "credentials",
      },
    });

    cookies().set({
      name: "visitor_session",
      value: newVisitor.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, visitor: newVisitor });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}