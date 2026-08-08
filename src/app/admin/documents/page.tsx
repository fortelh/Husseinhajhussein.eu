import { prisma } from "@/lib/prisma";
import { createDocument, deleteDocument } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Trash2, ShieldCheck, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DocumentForm } from "./components/DocumentForm";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Documents & Certifications</h1>
        <p className="text-slate-400 text-sm mt-1">Manage official credentials, degrees, licenses, and CV records.</p>
      </div>

      {/* Upload/Add Document Card */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          Add New Credential Record
        </h2>
        <DocumentForm action={createDocument} mediaItems={mediaItems} />
      </div>

      {/* Documents List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">{doc.name}</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {doc.category}
                </span>
              </div>
              {doc.description && <p className="text-xs text-slate-400">{doc.description}</p>}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{doc.isPublic ? "Publicly Accessible" : "Private Record"}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {doc.media && (
                <a
                  href={doc.media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View Asset File
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-2">
                <Link href={`/admin/documents/${doc.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <form action={deleteDocument.bind(null, doc.id)}>
                  <Button type="submit" variant="danger" size="sm" className="gap-1">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}