import Link from "next/link";
import { LayoutDashboard, User, FolderKanban, FileText, Image as ImageIcon, Settings, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Documents", href: "/admin/documents", icon: FileText },
    { label: "Media Assets", href: "/admin/media", icon: ImageIcon },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">CMS Control Center</h2>
            <p className="text-lg font-bold text-white mt-1">Admin Panel</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}