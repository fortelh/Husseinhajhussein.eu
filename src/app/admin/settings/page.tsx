import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import AdminSettingsView from "./AdminSettingsView";

export default async function AdminSettingsPage() {
  // Fetch standalone control panel login credentials safely on the server
  const adminLoginUsers = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch community visitors and filter them by role
  const visitors = await prisma.visitor.findMany({
    orderBy: { createdAt: "desc" },
  });

  const adminCommunityUsers = visitors.filter((v) => v.role === Role.ADMIN);
  const standardUsers = visitors.filter((v) => v.role === Role.USER);

  const currentEmail = await getAdminSession();

  return (
    <AdminSettingsView 
      adminLoginUsers={adminLoginUsers}
      adminCommunityUsers={adminCommunityUsers}
      standardUsers={standardUsers}
      currentEmail={currentEmail}
    />
  );
}