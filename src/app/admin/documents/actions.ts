"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

async function saveFileToDisk(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function createDocument(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as any;
  let mediaId = formData.get("mediaId") as string;
  const description = formData.get("description") as string;
  const isPublic = formData.get("isPublic") === "on";
  const file = formData.get("file") as File;

  if (!name) throw new Error("Document Name is required.");

  // If a file was uploaded from device, create a Media record for it first
  if (file && file.size > 0) {
    const fileUrl = await saveFileToDisk(file);
    if (fileUrl) {
      const newMedia = await prisma.media.create({
        data: {
          publicId: `local-${crypto.randomUUID()}`,
          url: fileUrl,
          type: "DOCUMENT", // or IMAGE/PDF depending on your enum
          altText: `${name} file`,
        },
      });
      mediaId = newMedia.id;
    }
  }

  if (!mediaId) {
    throw new Error("Please either upload a file or select an existing media asset.");
  }

  await prisma.document.create({
    data: {
      name,
      category,
      mediaId,
      description: description || "",
      isPublic,
    },
  });

  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  revalidatePath("/");
}

export async function updateDocument(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as any;
  let mediaId = formData.get("mediaId") as string;
  const description = formData.get("description") as string;
  const isPublic = formData.get("isPublic") === "on";
  const file = formData.get("file") as File;

  if (!name) throw new Error("Document Name is required.");

  // If a new replacement file was uploaded, create a new Media record
  if (file && file.size > 0) {
    const fileUrl = await saveFileToDisk(file);
    if (fileUrl) {
      const newMedia = await prisma.media.create({
        data: {
          publicId: `local-${crypto.randomUUID()}`,
          url: fileUrl,
          type: "DOCUMENT",
          altText: `${name} file`,
        },
      });
      mediaId = newMedia.id;
    }
  }

  const updateData: any = {
    name,
    category,
    description: description || "",
    isPublic,
  };

  if (mediaId) {
    updateData.mediaId = mediaId;
  }

  await prisma.document.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}/edit`);
  revalidatePath("/documents");
  revalidatePath("/");
}

export async function deleteDocument(id: string) {
  await prisma.document.delete({
    where: { id },
  });

  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  revalidatePath("/");
}