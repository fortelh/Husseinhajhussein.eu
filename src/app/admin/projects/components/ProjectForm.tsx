"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Save, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  altText: string | null;
}

interface ProjectMediaItem {
  id: string;
  media: MediaItem;
}

interface ProjectFormProps {
  action: (formData: FormData) => Promise<any>;
  initialData?: {
    id?: string;
    title?: string;
    technologies?: string[];
    client?: string | null;
    role?: string | null;
    location?: string | null;
    dateString?: string | null;
    shortDescription?: string;
    fullDescription?: string | null;
    featured?: boolean;
    media?: ProjectMediaItem[];
  };
  onDeleteImage?: (projectMediaId: string, projectId: string) => Promise<void>;
  isEdit?: boolean;
}

export function ProjectForm({ action, initialData, onDeleteImage, isEdit = false }: ProjectFormProps) {
  return (
    <Card className="space-y-6">
      {/* Existing Images Manager for Edit Mode */}
      {isEdit && initialData?.media && initialData.media.length > 0 && (
        <div className="space-y-3 pb-4 border-b border-slate-900">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">Currently Attached Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {initialData.media.map((pm) => (
              <div key={pm.id} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
                <div className="h-24 w-full relative">
                  <img src={pm.media.url} alt="Project asset" className="w-full h-full object-cover" />
                </div>
                {onDeleteImage && initialData.id && (
                  <button
                    type="button"
                    onClick={() => onDeleteImage(pm.id, initialData.id!)}
                    className="p-2 bg-slate-900 hover:bg-rose-500/20 border-t border-slate-800 flex items-center justify-center gap-1 text-xs text-rose-400 font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Native form action invocation with multipart encoding for file uploads */}
      <form action={action} encType="multipart/form-data" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title || ""}
              placeholder="High-Voltage Substation Automation"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Technologies (Comma separated)</label>
            <input
              type="text"
              name="technologies"
              defaultValue={initialData?.technologies?.join(", ") || ""}
              placeholder="Python, SCADA, IEC 61850, React"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Client / Organization</label>
            <input
              type="text"
              name="client"
              defaultValue={initialData?.client || ""}
              placeholder="Siemens Energy"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Role / Title</label>
            <input
              type="text"
              name="role"
              defaultValue={initialData?.role || ""}
              placeholder="Lead Automation Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={initialData?.location || ""}
              placeholder="Berlin, Germany"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Project Date <span className="text-cyan-400">*</span>
            </label>
            <input
              type="date"
              name="dateString"
              defaultValue={initialData?.dateString ? initialData.dateString.split('T')[0] : ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            defaultValue={initialData?.shortDescription || ""}
            placeholder="Brief summary for archive cards..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Full Case Study Description</label>
          <textarea
            name="fullDescription"
            rows={5}
            defaultValue={initialData?.fullDescription || ""}
            placeholder="Detailed architecture overview and deployment steps..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
            {isEdit ? "Upload Additional Images From Device" : "Upload Project Images (Multiple)"}
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            defaultChecked={initialData?.featured || false}
            className="rounded border-slate-700 bg-slate-950 text-cyan-500"
          />
          <label htmlFor="featured" className="text-xs text-slate-300 font-medium">Feature project on homepage overview</label>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2">
            {isEdit ? (
              <>
                <Save className="w-4 h-4" />
                Update Project Details
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Save Project
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}