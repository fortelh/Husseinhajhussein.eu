import { prisma } from "@/lib/prisma";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getExperiences() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getSkills() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        category: "asc",
      },
    });
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}