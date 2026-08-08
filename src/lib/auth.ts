"use server";

import { cookies } from "next/headers"; // Correct import path

const SESSION_COOKIE_NAME = "admin_session";

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}