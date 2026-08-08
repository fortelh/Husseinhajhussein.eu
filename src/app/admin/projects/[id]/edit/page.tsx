import { prisma } from "@/lib/prisma";
import { updateProject, deleteProjectImage } from "../../actions";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "../../components/ProjectForm";

interface EditProjectPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    success?: string;
  };
}

export default async function EditProjectPage({ params, searchParams }: EditProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { media: { include: { media: true } } },
  });

  if (!project) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, project.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects List
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Project: {project.title}</h1>
        <p className="text-slate-400 text-sm mt-1">Modify metadata, remove old images, or upload new files.</p>
      </div>

      {searchParams?.success === "edited" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Project updated successfully!
        </div>
      )}

      <ProjectForm
        action={updateProjectWithId}
        initialData={project}
        onDeleteImage={deleteProjectImage}
        isEdit={true}
      />
    </div>
  );
}