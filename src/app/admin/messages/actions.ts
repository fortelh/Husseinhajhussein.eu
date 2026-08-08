"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleReadStatus(id: string, currentStatus: boolean) {
  await prisma.contactMessage.update({
    where: { id },
    data: { read: !currentStatus },
  });

  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/admin/messages");
}