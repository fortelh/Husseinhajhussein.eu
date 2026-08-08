import { prisma } from "@/lib/prisma";
import AdminSkillsClient from "./AdminSkillsClient";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { proficiencyLevel: "desc" }],
  });

  return <AdminSkillsClient initialSkills={skills} />;
}