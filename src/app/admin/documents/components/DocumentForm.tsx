"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Save, CheckCircle2, Loader2 } from "lucide-react";
import { DocCategory } from "@prisma/client";

interface MediaItem {
  id: string;
  url: string;
  altText: string | null;
}

interface DocumentFormProps {
  action: (formData: FormData) => Promise<void>;
  mediaItems: MediaItem[];
  initialData?: {
    id?: string;
    name?: string;
    category?: DocCategory;
    mediaId?: string;
    description?: string | null;
    isPublic?: boolean;
  };
  isEdit?: boolean;
}

export function DocumentForm({ action, mediaItems, initialData, isEdit = false }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccessMessage(null);

    try {
      await action(formData);
      setSuccessMessage(isEdit ? "Credential updated successfully!" : "Credential added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      {successMessage && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Document Name</label>
            <input
              type="text"
              name="name"
              defaultValue={initialData?.name || ""}
              placeholder="Professional Engineering License"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Category</label>
            <select
              name="category"
              defaultValue={initialData?.category || Object.values(DocCategory)[0]}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            >
              {Object.values(DocCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Option A: Upload from device */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
            {isEdit ? "Upload Replacement File From Device (Optional)" : "Upload File From Device (PDF / Image)"}
          </label>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx,image/*"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
          />
        </div>

        {/* Option B: Select from existing repository */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Or Select Existing Media Asset Link
          </label>
          <select
            name="mediaId"
            defaultValue={initialData?.mediaId || ""}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
          >
            <option value="">-- Choose asset from repository --</option>
            {mediaItems.map((m) => (
              <option key={m.id} value={m.id}>{m.altText || m.url}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Description / Authority</label>
          <input
            type="text"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="Issued by National Board of Engineering..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            defaultChecked={initialData?.isPublic ?? true}
            className="rounded border-slate-700 bg-slate-950 text-cyan-500"
          />
          <label htmlFor="isPublic" className="text-xs text-slate-300 font-medium">Make document publicly downloadable</label>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              <>
                <Save className="w-4 h-4" />
                Update Credential
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Save Credential
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}