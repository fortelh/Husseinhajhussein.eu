```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminEmail = "admin@engineer.com";

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Hussein Haj Hussein",
      role: "ADMIN",
    },
  });

  // Create Profile Record
  await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      userId: adminUser.id,
      fullName: "Hussein Haj Hussein",
      professionalTitle: "Principal Systems & Project Engineer",
      heroTitle: "ENGINEER.PLATFORM // v1.0",
      heroSubtitle:
        "Specializing in industrial automation, clean power distribution, and enterprise software architecture.",
      shortIntro:
        "Principal Systems & Project Engineer specializing in industrial automation, clean power distribution, and enterprise software architecture.",
      aboutMe:
        "I have over a decade of hands-on leadership managing multi-megawatt engineering installations and crafting high-availability digital tools.",
      yearsOfExperience: 12,
      currentLocation: "Wuppertal, Germany",
      availabilityStatus: "OPEN_TO_OFFERS",
      contactEmail: adminEmail,
      socialLinks: {},
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```
