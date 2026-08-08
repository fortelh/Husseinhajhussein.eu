import { prisma } from "@/lib/prisma";
import { createProject, deleteProject } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FolderGit2, Trash2, Plus, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ProjectForm } from "./components/ProjectForm";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams?: { success?: string };
}) {
  // Changed orderBy to createdAt: "desc" so newly created projects always stay at the top
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { media: { include: { media: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Projects Archive Management</h1>
        <p className="text-slate-400 text-sm mt-1">Create, configure, and manage engineering case studies and deployments.</p>
      </div>

      {searchParams?.success === "created" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Project added successfully!
        </div>
      )}

      {/* Add Project Form Component */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          Add New Project Deployment
        </h2>
        <ProjectForm action={createProject} />
      </div>

      {/* Existing Projects List */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <h2 className="text-lg font-bold text-white">Existing Projects</h2>
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{project.shortDescription}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link href={`/admin/projects/${project.id}/edit`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <form action={deleteProject.bind(null, project.id)}>
                <Button type="submit" variant="danger" size="sm" className="gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}