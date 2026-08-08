import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { 
  FolderGit2, 
  Briefcase, 
  Cpu, 
  FileText, 
  Image as ImageIcon, 
  Mail, 
  Globe, 
  ShieldAlert, 
  ArrowUpRight,
  Activity,
  Flag
} from "lucide-react";

export default async function AdminDashboardPage() {
  // Fetch real-time counts for all core modules + pending comment reports
  const [
    projectsCount,
    experienceCount,
    skillsCount,
    documentsCount,
    mediaCount,
    unreadMessagesCount,
    auditLogsCount,
    pendingReportsCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.document.count(),
    prisma.media.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.auditLog.count(),
    prisma.commentReport.count({ where: { status: "pending" } }),
  ]);

  const modules = [
    {
      title: "Projects Archive",
      description: "Manage case studies and engineering deployments.",
      count: projectsCount,
      icon: FolderGit2,
      href: "/admin/projects",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Career & Education",
      description: "Work history and academic background records.",
      count: experienceCount,
      icon: Briefcase,
      href: "/admin/experience",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Skills & Matrix",
      description: "Technical competencies and proficiency levels.",
      count: skillsCount,
      icon: Cpu,
      href: "/admin/skills",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Documents & CV",
      description: "Official credentials, licenses, and file links.",
      count: documentsCount,
      icon: FileText,
      href: "/admin/documents",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Media Assets",
      description: "Manage repository pictures, documents, and uploads.",
      count: mediaCount,
      icon: ImageIcon,
      href: "/admin/media",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Client Inquiries",
      description: "Contact form messages and project proposals.",
      count: unreadMessagesCount,
      label: unreadMessagesCount > 0 ? `${unreadMessagesCount} Unread` : undefined,
      icon: Mail,
      href: "/admin/messages",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Reported Comments",
      description: "Review flagged community discussions and moderate reports.",
      count: pendingReportsCount,
      label: pendingReportsCount > 0 ? `${pendingReportsCount} Pending` : undefined,
      icon: Flag,
      href: "/admin/reports",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "SEO Metadata",
      description: "Search engine tags, titles, and OpenGraph configs.",
      icon: Globe,
      href: "/admin/seo",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Security Audit Logs",
      description: "Activity trail of administrative changes.",
      count: auditLogsCount,
      icon: ShieldAlert,
      href: "/admin/audit",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Control Center</h1>
        <p className="text-slate-400 text-sm">Welcome back. Select a module below to manage your portfolio infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.title} href={mod.href} className="group">
              <Card className="h-full space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${mod.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {mod.label ? (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                        {mod.label}
                      </span>
                    ) : mod.count !== undefined ? (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                        {mod.count} records
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                      {mod.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">Configure →</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}