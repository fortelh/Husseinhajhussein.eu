"use server";

import { prisma } from "@/lib/prisma";
import { setAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    throw new Error("Invalid credentials.");
  }

  const passwordValid = await bcrypt.compare(password, admin.password);
  if (!passwordValid) {
    throw new Error("Invalid credentials.");
  }

  await setAdminSession(admin.email);
  redirect("/admin");
}