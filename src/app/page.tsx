import { prisma } from "@/lib/prisma";
import { MapPin, Mail, Layers, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import ProjectInteractionSection from "@/components/ProjectInteractionSection"; // Client component for buttons & modals
import PostImageGallery from "@/components/PostImageGallery"; // 🖼️ Imported fancy image gallery

export default async function PublicHomePage() {
  // Fetch profile details managed by your admin profile panel
  const profile = await prisma.profile.findFirst();

  // Check if visitor session exists (properly awaited for Next.js compatibility)
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitor_session")?.value;
  const currentVisitor = visitorId 
    ? await prisma.visitor.findUnique({ where: { id: visitorId } }) 
    : null;

  // Fetch only featured projects for the homepage overview feed
  const projects = await prisma.project.findMany({
    where: { featured: true }, // <-- Filters projects to only show featured ones
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        include: {
          media: true, // Pulls the actual Media asset details through ProjectMedia relation
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          visitor: true, // Pulls the Visitor details who commented
        },
      },
      likes: {
        include: {
          visitor: true, // Pulls Visitor details who liked
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <header className="border-b border-slate-900 bg-gradient-to-b from-slate-900/40 to-slate-950 py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <span>{profile?.availabilityStatus || "AVAILABLE"}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            {profile?.fullName || "Portfolio Engineer"}
          </h1>
          
          <p className="text-xl font-medium text-cyan-400">
            {profile?.professionalTitle || "Systems & Software Architect"}
          </p>

          {/* Hero Title (Dynamic) */}
          {profile?.heroTitle && (
            <h2 className="text-lg md:text-xl font-semibold text-slate-200">
              {profile.heroTitle}
            </h2>
          )}

          {/* Hero Subtitle / Short Intro */}
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            {profile?.heroSubtitle || profile?.shortIntro || "Welcome to my engineering feed and professional activity updates."}
          </p>

          {/* Location, Experience & Email Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 pt-2">
            {profile?.currentLocation && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{profile.currentLocation}</span>
              </div>
            )}
            {profile?.yearsOfExperience !== undefined && profile.yearsOfExperience > 0 && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>{profile.yearsOfExperience} Years Experience</span>
              </div>
            )}
            {profile?.contactEmail && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{profile.contactEmail}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* About Me Section */}
      {profile?.aboutMe && (
        <section className="max-w-2xl mx-auto px-4 pt-10">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-3 shadow-lg backdrop-blur-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <User className="w-4 h-4" /> About Me
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {profile.aboutMe}
            </p>
          </div>
        </section>
      )}

      {/* Main Social Feed Section */}
      <main className="max-w-2xl mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Featured Projects Feed
          </h2>
          <span className="text-xs font-mono text-slate-500">{projects.length} Posts</span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
            <p className="text-slate-400 text-sm">No featured project posts published yet by the administrator.</p>
          </div>
        ) : (
          projects.map((project) => {
            const imageUrls = project.media.map((pm: any) => pm.media?.url).filter(Boolean);
            const hasLiked = currentVisitor ? project.likes.some(l => l.visitorId === currentVisitor.id) : false;

            return (
              <article key={project.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
                
                {/* Post Header */}
                <div className="p-4 pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
                      {profile?.fullName?.charAt(0) || "A"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{profile?.fullName || "Administrator"}</h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Title & Short Description */}
                <div className="px-4 space-y-2">
                  <Link href={`/projects/${project.id}`}>
                    <h4 className="font-bold text-white text-base hover:text-cyan-400 transition-colors">{project.title}</h4>
                  </Link>
                  <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* 🖼️ Media Gallery Component Integrated */}
                {imageUrls.length > 0 && (
                  <PostImageGallery images={imageUrls} />
                )}

                {/* Engagement Metrics & Interactive Buttons (Client Component) */}
                <ProjectInteractionSection 
                  projectId={project.id} 
                  initialLikesCount={project.likes.length}
                  initialHasLiked={hasLiked}
                  initialComments={project.comments}
                  isLoggedIn={!!currentVisitor}
                  currentVisitorId={currentVisitor?.id}
                />

              </article>
            );
          })
        )}
      </main>
    </div>
  );
}