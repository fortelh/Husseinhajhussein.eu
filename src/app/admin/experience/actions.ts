"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExperience(prevState: any, formData: FormData) {
  try {
    const company = formData.get("company") as string;
    const position = formData.get("position") as string;
    const location = formData.get("location") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDateInput = formData.get("endDate") as string;
    const endDate = endDateInput ? new Date(endDateInput) : null;
    const current = formData.get("current") === "on";
    const description = formData.get("description") as string;

    if (!company || !position) return { success: false, message: "Company and position are required." };

    await prisma.experience.create({
      data: {
        company,
        position,
        location: location || "",
        startDate,
        endDate: current ? null : endDate,
        current,
        description: description || "",
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, message: "Experience added successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to add experience." };
  }
}

export async function updateExperience(id: string, prevState: any, formData: FormData) {
  try {
    const company = formData.get("company") as string;
    const position = formData.get("position") as string;
    const location = formData.get("location") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDateInput = formData.get("endDate") as string;
    const endDate = endDateInput ? new Date(endDateInput) : null;
    const current = formData.get("current") === "on";
    const description = formData.get("description") as string;

    if (!company || !position) return { success: false, message: "Company and position are required." };

    await prisma.experience.update({
      where: { id },
      data: {
        company,
        position,
        location: location || "",
        startDate,
        endDate: current ? null : endDate,
        current,
        description: description || "",
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, message: "Experience updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update experience." };
  }
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({
    where: { id },
  });

  revalidatePath("/admin/experience");
  revalidatePath("/");
}

export async function createEducation(prevState: any, formData: FormData) {
  try {
    const institution = formData.get("institution") as string;
    const degree = formData.get("degree") as string;
    const fieldOfStudy = formData.get("fieldOfStudy") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDateInput = formData.get("endDate") as string;
    const endDate = endDateInput ? new Date(endDateInput) : null;
    const description = formData.get("description") as string;

    if (!institution || !degree) return { success: false, message: "Institution and degree are required." };

    await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy: fieldOfStudy || "",
        startDate,
        endDate,
        description: description || "",
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, message: "Education added successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to add education." };
  }
}

export async function updateEducation(id: string, prevState: any, formData: FormData) {
  try {
    const institution = formData.get("institution") as string;
    const degree = formData.get("degree") as string;
    const fieldOfStudy = formData.get("fieldOfStudy") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDateInput = formData.get("endDate") as string;
    const endDate = endDateInput ? new Date(endDateInput) : null;
    const description = formData.get("description") as string;

    if (!institution || !degree) return { success: false, message: "Institution and degree are required." };

    await prisma.education.update({
      where: { id },
      data: {
        institution,
        degree,
        fieldOfStudy: fieldOfStudy || "",
        startDate,
        endDate,
        description: description || "",
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, message: "Education updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update education." };
  }
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({
    where: { id },
  });

  revalidatePath("/admin/experience");
  revalidatePath("/");
}