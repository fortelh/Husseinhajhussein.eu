"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";

async function uploadFileToCloudinary(file: File): Promise<{ url: string; publicId: string } | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio-documents",
        resource_type: "auto", // Automatically handles PDFs, images, docs, etc.
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Failed to upload file to Cloudinary"));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function createDocument(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as any;
  let mediaId = formData.get("mediaId") as string;
  const description = formData.get("description") as string;
  const isPublic = formData.get("isPublic") === "on";
  const file = formData.get("file") as File;

  if (!name) throw new Error("Document Name is required.");

  // If a file was uploaded from device, upload it to Cloudinary
  if (file && file.size > 0) {
    const uploadedData = await uploadFileToCloudinary(file);
    if (uploadedData) {
      const newMedia = await prisma.media.create({
        data: {
          publicId: uploadedData.publicId,
          url: uploadedData.url,
          type: "DOCUMENT",
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

  // If a new replacement file was uploaded, upload it to Cloudinary
  if (file && file.size > 0) {
    const uploadedData = await uploadFileToCloudinary(file);
    if (uploadedData) {
      const newMedia = await prisma.media.create({
        data: {
          publicId: uploadedData.publicId,
          url: uploadedData.url,
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
