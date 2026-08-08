"use client";
import { useEffect } from "react";

export function InactivityTimer() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 2 minutes of inactivity (120,000 ms)
      timeoutId = setTimeout(async () => {
        try {
          await fetch("/api/visitor/logout", { method: "POST" });
          window.location.reload();
        } catch (error) {
          console.error("Auto logout failed", error);
        }
      }, 120 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return null;
}