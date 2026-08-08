import { prisma } from "@/lib/prisma";

export async function getActiveProfile() {
  const profile = await prisma.profile.findFirst({
    include: {
      profileImage: true,
      coverImage: true,
    },
  });
  return profile;
}

export async function updateProfile(userId: string, data: any) {
  const profile = await prisma.profile.update({
    where: { userId },
    data,
  });
  return profile;
}