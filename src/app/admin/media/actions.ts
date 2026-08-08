"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMediaRecord(formData: FormData) {
  const url = formData.get("url") as string;
  const publicId = formData.get("publicId") as string;
  const type = formData.get("type") as string;
  const altText = formData.get("altText") as string;

  if (!url) return;

  await prisma.media.create({
    data: {
      url,
      publicId: publicId || "local_asset",
      type: type === "DOCUMENT" ? "DOCUMENT" : "IMAGE",
      altText: altText || "",
    },
  });

  revalidatePath("/admin/media");
}

export async function deleteMediaRecord(id: string) {
  await prisma.media.delete({
    where: { id },
  });

  revalidatePath("/admin/media");
}