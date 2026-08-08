"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { clearAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export async function createAdminUserAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email and password required." };
    }

    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return { success: false, message: `An admin login user with the email "${email}" already exists.` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.adminUser.create({
      data: { email, password: hashedPassword },
    });

    revalidatePath("/admin/settings");
    return { success: true, message: `Admin credential "${email}" created successfully!` };
  } catch (err: any) {
    return { success: false, message: err.message || "Something went wrong." };
  }
}

export async function updateAdminUserAction(formData: FormData) {
  const id = formData.get("id") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const data: any = { email };

  if (password && password.trim() !== "") {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.adminUser.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/settings");
}

export async function deleteAdminUserAction(formData: FormData) {
  const id = formData.get("id") as string;
  
  const count = await prisma.adminUser.count();
  if (count <= 1) {
    throw new Error("You cannot delete the last remaining admin credential.");
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/settings");
}

export async function createVisitorAction(prevState: any, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const role = (formData.get("role") as Role) || Role.USER;

    if (!email || !password) {
      return { success: false, message: "Email and password required." };
    }

    const existingVisitor = await prisma.visitor.findUnique({
      where: { email },
    });

    if (existingVisitor) {
      return { success: false, message: `A user with the email "${email}" already exists.` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.visitor.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        role,
      },
    });

    revalidatePath("/admin/settings");
    return { success: true, message: `Community user "${email}" created successfully!` };
  } catch (err: any) {
    return { success: false, message: err.message || "Something went wrong." };
  }
}

export async function updateVisitorAction(formData: FormData) {
  const id = formData.get("id") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  const data: any = {
    firstName,
    lastName,
    email,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    role,
  };

  if (password && password.trim() !== "") {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.visitor.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/settings");
}

export async function toggleRoleAction(formData: FormData) {
  const id = formData.get("id") as string;
  const currentRole = formData.get("currentRole") as Role;
  const newRole = currentRole === Role.ADMIN ? Role.USER : Role.ADMIN;

  await prisma.visitor.update({
    where: { id },
    data: { role: newRole },
  });

  revalidatePath("/admin/settings");
}

export async function deleteVisitorAction(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.visitor.delete({ where: { id } });
  revalidatePath("/admin/settings");
}

export async function terminateSessionAction() {
  await clearAdminSession();
  redirect("/admin/login");
}