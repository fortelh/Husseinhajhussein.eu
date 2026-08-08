import Link from "next/link";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-sm">Engineering Portfolio System</span>
        </div>

        <p className="text-xs text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} All rights reserved. Built with Next.js & Prisma.
        </p>

        <div className="flex items-center gap-4 text-slate-400">
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">
            <Mail className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </footer>
  );
}