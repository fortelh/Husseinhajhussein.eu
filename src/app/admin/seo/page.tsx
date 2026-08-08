import { prisma } from "@/lib/prisma";
import { upsertSeoMetadata } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Globe, Save } from "lucide-react";

export default async function AdminSeoPage() {
  const seoEntries = await prisma.seoMetadata.findMany({
    orderBy: { pageKey: "asc" },
  });

  const defaultPages = ["home", "projects", "blog", "contact", "resume"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">SEO Metadata & OpenGraph</h1>
        <p className="text-slate-400 text-sm mt-1">Configure search engine titles, descriptions, keywords, and share preview assets per route.</p>
      </div>

      <div className="space-y-6">
        {defaultPages.map((pageKey) => {
          const existing = seoEntries.find((s) => s.pageKey === pageKey);

          return (
            <Card key={pageKey} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-white">Route: /{pageKey === "home" ? "" : pageKey}</h3>
              </div>

              <form action={upsertSeoMetadata} className="space-y-4">
                <input type="hidden" name="pageKey" value={pageKey} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={existing?.title || ""}
                      placeholder="Page Title | Engineering Portfolio"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      name="keywords"
                      defaultValue={existing?.keywords.join(", ") || ""}
                      placeholder="automation, electrical, systems"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Meta Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={existing?.description || ""}
                    placeholder="Brief description for search engine results..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">OpenGraph Image URL</label>
                  <input
                    type="url"
                    name="ogImage"
                    defaultValue={existing?.ogImage || ""}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save SEO Config
                  </Button>
                </div>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}