import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { InactivityTimer } from "@/components/InactivityTimer"; // Import the client timer
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineering Portfolio & System Hub",
  description: "Professional portfolio, projects, resume, and technical write-ups.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch visitor session globally in the root layout
  const visitorId = cookies().get("visitor_session")?.value;
  const currentVisitor = visitorId 
    ? await prisma.visitor.findUnique({ where: { id: visitorId } }) 
    : null;

  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950`}>
        {/* Client component to handle 2-minute inactivity auto-logout */}
        <InactivityTimer />
        
        <Navbar visitor={currentVisitor} />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}