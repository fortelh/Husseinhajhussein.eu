import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { FolderGit2, ArrowUpRight, Calendar, MapPin } from "lucide-react";

export default async function PublicProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { media: { include: { media: true } } },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4 border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
            <FolderGit2 className="w-4 h-4" />
            Project Archive
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Engineering Systems & Deployments</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Explore a comprehensive record of software architectures, automation pipelines, and engineering case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="space-y-4 flex flex-col justify-between hover:border-cyan-500/50 transition-all">
              <div className="space-y-3">
                {project.media[0] && (
                  <div className="h-48 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 relative">
                    <img src={project.media[0].media.url} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                  {project.dateString && (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.dateString}
                    </span>
                  )}
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">{project.shortDescription}</p>

                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  View Case Study
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}