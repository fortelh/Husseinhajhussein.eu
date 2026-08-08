import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Building2, UserCheck } from "lucide-react";
import Link from "next/link";
import PostImageGallery from "@/components/PostImageGallery";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await prisma.profile.findFirst();
  
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      media: {
        include: {
          media: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const imageUrls = project.media.map((pm: any) => pm.media?.url).filter(Boolean);

  // Check possible field names for full description
  const fullDescriptionText = 
    (project as any).description || 
    (project as any).content || 
    (project as any).fullDescription;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-20">
      {/* Navigation Header */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>

      <main className="max-w-2xl mx-auto px-4 space-y-6">
        <article className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-5 p-6">
          
          {/* Project Header Info Meta */}
          <div className="space-y-3">
            <h1 className="font-extrabold text-white text-2xl sm:text-3xl tracking-tight">{project.title}</h1>
            
            {/* Conditional metadata row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              {project.client && (
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Building2 className="w-3.5 h-3.5" />
                  {project.client}
                </span>
              )}
              {project.role && (
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  {project.role}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {project.location}
                </span>
              )}
              {project.dateString && (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.dateString}
                </span>
              )}
            </div>
          </div>

          {/* Technologies Stack Tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech: string) => (
                <span key={tech} className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Short Description */}
          {project.shortDescription && (
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              {project.shortDescription}
            </p>
          )}

          {/* 🖼️ IMAGE GALLERY */}
          {imageUrls.length > 0 && (
            <PostImageGallery images={imageUrls} />
          )}

          {/* Full Case Study Description */}
          {fullDescriptionText && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Full Case Study Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {fullDescriptionText}
              </p>
            </div>
          )}

        </article>
      </main>
    </div>
  );
}