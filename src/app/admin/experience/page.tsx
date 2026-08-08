import { prisma } from "@/lib/prisma";
import AdminExperienceClient from "./AdminExperienceClient";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  const educations = await prisma.education.findMany({
    orderBy: { startDate: "desc" },
  });

  return <AdminExperienceClient initialExperiences={experiences} initialEducations={educations} />;
}