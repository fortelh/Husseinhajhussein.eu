import { prisma } from "@/lib/prisma";
import { updateDocument } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentForm } from "../../components/DocumentForm";

interface EditDocumentPageProps {
  params: {
    id: string;
  };
}

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: { media: true },
  });

  if (!document) {
    notFound();
  }

  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  const updateDocumentWithId = updateDocument.bind(null, document.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Documents List
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Credential: {document.name}</h1>
        <p className="text-slate-400 text-sm mt-1">Modify title, category, media link, or visibility settings.</p>
      </div>

      <DocumentForm
        action={updateDocumentWithId}
        mediaItems={mediaItems}
        initialData={document}
        isEdit={true}
      />
    </div>
  );
}