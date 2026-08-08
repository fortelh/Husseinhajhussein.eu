import { prisma } from "@/lib/prisma";
import { createMediaRecord, deleteMediaRecord } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";

export default async function AdminMediaPage() {
  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Media Repository</h1>
        <p className="text-slate-400 text-sm mt-1">Manage uploaded images, diagrams, and document references.</p>
      </div>

      {/* Upload/Add Media Form Card */}
      <Card>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-400" />
          Add Media Asset URL
        </h2>
        <form action={createMediaRecord} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Asset URL / Secure Link</label>
            <input
              type="url"
              name="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Asset Type</label>
            <select
              name="type"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            >
              <option value="IMAGE">IMAGE</option>
              <option value="DOCUMENT">DOCUMENT</option>
            </select>
          </div>

          <div>
            <Button type="submit" className="w-full">Add Asset</Button>
          </div>
        </form>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <Card key={item.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative">
                {item.type === "IMAGE" ? (
                  <img src={item.url} alt={item.altText || "Media asset"} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-cyan-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {item.type}
                </span>
                <p className="text-xs text-slate-400 truncate mt-2">{item.url}</p>
              </div>
            </div>

            <form action={deleteMediaRecord.bind(null, item.id)}>
              <Button type="submit" variant="danger" size="sm" className="w-full gap-2">
                <Trash2 className="w-3.5 h-3.5" />
                Delete Asset
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}