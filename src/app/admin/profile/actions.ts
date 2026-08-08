"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AvailabilityStatus } from "@prisma/client";

export async function updateProfile(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const professionalTitle = formData.get("professionalTitle") as string;
  // Ensure heroTitle is captured, with a fallback if empty
  const heroTitle = (formData.get("heroTitle") as string) || professionalTitle || "Welcome";
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const shortIntro = formData.get("shortIntro") as string;
  const aboutMe = formData.get("aboutMe") as string;
  const currentLocation = formData.get("currentLocation") as string;
  const yearsOfExperience = parseInt((formData.get("yearsOfExperience") as string) || "0", 10);
  const contactEmail = formData.get("contactEmail") as string;
  
  const rawStatus = formData.get("availabilityStatus") as string;
  const availabilityStatus = Object.values(AvailabilityStatus).includes(rawStatus as AvailabilityStatus)
    ? (rawStatus as AvailabilityStatus)
    : AvailabilityStatus.AVAILABLE;

  // 1. Find or create a default user to satisfy the relation constraint
  let adminUser = await prisma.user.findFirst();

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: contactEmail || "admin@example.com",
        name: fullName || "Administrator",
        role: "ADMIN",
      },
    });
  }

  // 2. Check if profile exists
  const existingProfile = await prisma.profile.findFirst();

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        fullName,
        professionalTitle,
        heroTitle,
        heroSubtitle,
        shortIntro,
        aboutMe,
        currentLocation,
        yearsOfExperience,
        contactEmail,
        availabilityStatus,
      },
    });
  } else {
    await prisma.profile.create({
      data: {
        user: {
          connect: { id: adminUser.id },
        },
        fullName,
        professionalTitle,
        heroTitle, // Must be a valid string per your schema
        heroSubtitle,
        shortIntro: shortIntro || professionalTitle, // Ensure it's not null if required by your form
        aboutMe,
        currentLocation,
        yearsOfExperience,
        contactEmail,
        availabilityStatus,
        socialLinks: {},
      },
    });
  }

  revalidatePath("/admin/profile");
  revalidatePath("/");
}