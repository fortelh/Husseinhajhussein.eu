"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      return { success: false, message: "All fields are required." };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    revalidatePath("/admin/messages");
    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to send message. Please try again." };
  }
}