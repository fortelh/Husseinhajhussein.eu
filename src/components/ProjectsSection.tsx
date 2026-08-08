import { getProjects } from "@/lib/portfolio-data";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import ProjectInteractionSection from "@/components/ProjectInteractionSection";

export default async function ProjectsSection() {
  const projects = await getProjects();

  if (!projects || projects.length === 0) {
    return null;
  }

  // 1. Get current logged-in visitor session
  const visitorId = cookies().get("visitor_session")?.value;
  const currentVisitor = visitorId
    ? await prisma.visitor.findUnique({ where: { id: visitorId } })
    : null;

  return (
    <section className="max-w-6xl mx-auto py-20 px-6 sm:px-12">
      <div className="flex items-center gap-3 mb-10">
        <FolderGit2 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Featured Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: any) => {
          const hasLiked = project.likes?.some((l: any) => l.visitorId === currentVisitor?.id);

          return (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-3 text-slate-400">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Technologies Stack */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
                {project.technologies?.map((pt: any) => (
                  <span
                    key={pt.skill.id}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium"
                  >
                    {pt.skill.name}
                  </span>
                ))}
              </div>

              {/* 2. Interactive Comments & Likes Widget */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 -mx-6 -mb-6 bg-slate-950/40 rounded-b-2xl">
                <ProjectInteractionSection
                  projectId={project.id}
                  initialLikesCount={project.likes?.length || 0}
                  initialHasLiked={hasLiked}
                  initialComments={project.comments || []}
                  isLoggedIn={!!currentVisitor}
                  currentVisitorId={currentVisitor?.id}
                  currentVisitorRole={currentVisitor?.role}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}