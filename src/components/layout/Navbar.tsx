import Link from "next/link";
import HeaderAuthWidget from "@/components/HeaderAuthWidget";

export function Navbar({ visitor }: { visitor: any }) {
  return (
    <nav className="w-full border-b border-slate-900 bg-slate-950 px-6 py-4 flex items-center justify-between">
      
      {/* LEFT SIDE: Logo + Sign In / Profile Picture Widget */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-white font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono">
            &gt;_
          </div>
        </Link>

        {/* Profile picture & sign-in / name widget placed on the left */}
        <HeaderAuthWidget visitor={visitor} />
      </div>

      {/* RIGHT SIDE: Navigation Links */}
      <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/projects" className="hover:text-white transition-colors">
          Projects
        </Link>
        <Link href="/resume" className="hover:text-white transition-colors">
          Resume
        </Link>
        <Link href="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>

        {/* Admin Link (Only visible if the logged in visitor has ADMIN role) */}
        {visitor?.role === "ADMIN" && (
          <Link 
            href="/admin" 
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 rounded-xl transition-colors"
          >
            Admin
          </Link>
        )}
      </div>

    </nav>
  );
}
