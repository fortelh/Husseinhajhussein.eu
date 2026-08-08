"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSkill(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const proficiencyLevel = parseInt(formData.get("proficiencyLevel") as string) || 80;
    const yearsOfExperience = parseFloat(formData.get("yearsOfExperience") as string) || 1.0;
    const featured = formData.get("featured") === "on";

    if (!name || !category) return { success: false, message: "Name and category are required." };

    await prisma.skill.create({
      data: {
        name,
        category,
        description: description || "",
        proficiencyLevel,
        yearsOfExperience,
        featured,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, message: "Skill added successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to add skill." };
  }
}

export async function updateSkill(id: string, prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const proficiencyLevel = parseInt(formData.get("proficiencyLevel") as string) || 80;
    const yearsOfExperience = parseFloat(formData.get("yearsOfExperience") as string) || 1.0;
    const featured = formData.get("featured") === "on";

    if (!name || !category) return { success: false, message: "Name and category are required." };

    await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        description: description || "",
        proficiencyLevel,
        yearsOfExperience,
        featured,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, message: "Skill updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update skill." };
  }
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({
    where: { id },
  });

  revalidatePath("/admin/skills");
  revalidatePath("/");
}