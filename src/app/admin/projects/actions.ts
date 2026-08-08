"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";

// Helper to handle multi-file uploads to Cloudinary
async function processUploadedImages(formData: FormData): Promise<{ mediaId: string }[] | string[]> {
  const files = formData.getAll("images") as File[];
  const mediaIds: string[] = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadedData = await new Promise<{ url: string; publicId: string } | null>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio-projects",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary project upload error:", error);
              reject(new Error("Failed to upload project image to Cloudinary"));
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

      if (uploadedData) {
        const createdMedia = await prisma.media.create({
          data: {
            url: uploadedData.url,
            publicId: uploadedData.publicId,
            type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
            altText: file.name,
          },
        });
        mediaIds.push(createdMedia.id);
      }
    }
  }

  return mediaIds;
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${Date.now()}`;
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;
  const location = formData.get("location") as string || "Wuppertal, Germany";
  const dateString = formData.get("dateString") as string || new Date().toISOString().split("T")[0];
  const role = formData.get("role") as string;
  const client = formData.get("client") as string;
  const technologies = (formData.get("technologies") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const featured = formData.get("featured") === "on";

  const newMediaIds = (await processUploadedImages(formData)) as string[];

  await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        title,
        slug,
        shortDescription,
        fullDescription,
        location,
        dateString,
        role: role || "",
        client: client || null,
        technologies,
        featured,
      },
    });

    if (newMediaIds.length > 0) {
      await tx.projectMedia.createMany({
        data: newMediaIds.map((mediaId, index) => ({
          projectId: newProject.id,
          mediaId,
          order: index,
        })),
      });
    }
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects?success=created");
}

export async function updateProject(projectId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = formData.get("fullDescription") as string;
  const location = formData.get("location") as string;
  const dateString = formData.get("dateString") as string;
  const role = formData.get("role") as string;
  const client = formData.get("client") as string;
  const technologies = (formData.get("technologies") as string || "").split(",").map(t => t.trim()).filter(Boolean);
  const featured = formData.get("featured") === "on";

  const newMediaIds = (await processUploadedImages(formData)) as string[];

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: projectId },
      data: {
        title,
        shortDescription,
        fullDescription,
        location,
        dateString,
        role: role || "",
        client: client || null,
        technologies,
        featured,
      },
    });

    if (newMediaIds.length > 0) {
      const existingCount = await tx.projectMedia.count({ where: { projectId } });
      await tx.projectMedia.createMany({
        data: newMediaIds.map((mediaId, index) => ({
          projectId,
          mediaId,
          order: existingCount + index,
        })),
      });
    }
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/");
  redirect("/admin/projects?success=edited");
}

export async function deleteProjectImage(projectMediaId: string, projectId: string) {
  "use server";

  const projectMedia = await prisma.projectMedia.findUnique({
    where: { id: projectMediaId },
    include: { media: true },
  });

  if (projectMedia) {
    const mediaRecord = projectMedia.media;

    // If it's stored on Cloudinary and has a valid publicId, you can optionally delete it from Cloudinary too
    if (mediaRecord.publicId && !mediaRecord.publicId.startsWith("local")) {
      try {
        await cloudinary.uploader.destroy(mediaRecord.publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    await prisma.media.delete({ where: { id: mediaRecord.id } });
  }

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
