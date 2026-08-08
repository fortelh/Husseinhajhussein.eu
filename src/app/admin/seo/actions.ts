"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertSeoMetadata(formData: FormData) {
  const pageKey = formData.get("pageKey") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywordsInput = formData.get("keywords") as string;
  const ogImage = formData.get("ogImage") as string;

  if (!pageKey || !title) return;

  const keywords = keywordsInput ? keywordsInput.split(",").map((k) => k.trim()) : [];

  await prisma.seoMetadata.upsert({
    where: { pageKey },
    update: {
      title,
      description,
      keywords,
      ogImage: ogImage || null,
    },
    create: {
      pageKey,
      title,
      description,
      keywords,
      ogImage: ogImage || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/seo");
}