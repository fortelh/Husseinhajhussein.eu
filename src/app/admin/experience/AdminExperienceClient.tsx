"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { 
  createExperience, 
  updateExperience, 
  deleteExperience, 
  createEducation, 
  updateEducation, 
  deleteEducation 
} from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, GraduationCap, Trash2, Edit2, X, CheckCircle2 } from "lucide-react";

export default function AdminExperienceClient({ initialExperiences, initialEducations }: { initialExperiences: any[]; initialEducations: any[] }) {
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);

  // Form hooks with action state
  const [expState, expAction] = useFormState(
    editingExp ? updateExperience.bind(null, editingExp.id) : createExperience, 
    null
  );
  const [eduState, eduAction] = useFormState(
    editingEdu ? updateEducation.bind(null, editingEdu.id) : createEducation, 
    null
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle success banners
  useEffect(() => {
    if (expState?.success) {
      setSuccessMessage(expState.message);
      setEditingExp(null);
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [expState]);

  useEffect(() => {
    if (eduState?.success) {
      setSuccessMessage(eduState.message);
      setEditingEdu(null);
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [eduState]);

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Career & Education</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your professional work history and academic background.</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Experience Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Work Experience
          </h2>
          {editingExp && (
            <Button variant="ghost" size="sm" onClick={() => setEditingExp(null)} className="gap-1 text-slate-400">
              <X className="w-4 h-4" /> Cancel Editing
            </Button>
          )}
        </div>

        <Card>
          <form action={expAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  defaultValue={editingExp?.company || ""}
                  placeholder="Siemens Energy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Position / Title</label>
                <input
                  type="text"
                  name="position"
                  defaultValue={editingExp?.position || ""}
                  placeholder="Senior Automation Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingExp?.location || ""}
                  placeholder="Munich, Germany"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={formatDateForInput(editingExp?.startDate)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={formatDateForInput(editingExp?.endDate)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="current" 
                id="current-exp" 
                defaultChecked={editingExp?.current || false}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500" 
              />
              <label htmlFor="current-exp" className="text-xs text-slate-300">I currently work here</label>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Description & Responsibilities</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingExp?.description || ""}
                placeholder="Led control systems migration..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">{editingExp ? "Update Experience" : "Add Experience"}</Button>
            </div>
          </form>
        </Card>

        {/* Existing Experiences List */}
        <div className="space-y-3">
          {initialExperiences.map((exp) => (
            <Card key={exp.id} className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{exp.position} <span className="text-cyan-400">@ {exp.company}</span></h3>
                <p className="text-xs text-slate-400 mt-1">{exp.location} • {new Date(exp.startDate).getFullYear()} - {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingExp(exp)} className="gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
                <form action={deleteExperience.bind(null, exp.id)}>
                  <Button type="submit" variant="danger" size="sm" className="gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            Education & Degrees
          </h2>
          {editingEdu && (
            <Button variant="ghost" size="sm" onClick={() => setEditingEdu(null)} className="gap-1 text-slate-400">
              <X className="w-4 h-4" /> Cancel Editing
            </Button>
          )}
        </div>

        <Card>
          <form action={eduAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Institution</label>
                <input
                  type="text"
                  name="institution"
                  defaultValue={editingEdu?.institution || ""}
                  placeholder="Technical University"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Degree</label>
                <input
                  type="text"
                  name="degree"
                  defaultValue={editingEdu?.degree || ""}
                  placeholder="Master of Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Field of Study</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  defaultValue={editingEdu?.fieldOfStudy || ""}
                  placeholder="Electrical Engineering"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={formatDateForInput(editingEdu?.startDate)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={formatDateForInput(editingEdu?.endDate)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Description</label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editingEdu?.description || ""}
                placeholder="Specialized in power grids..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">{editingEdu ? "Update Education" : "Add Education"}</Button>
            </div>
          </form>
        </Card>

        {/* Existing Educations List */}
        <div className="space-y-3">
          {initialEducations.map((edu) => (
            <Card key={edu.id} className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{edu.degree} in {edu.fieldOfStudy} <span className="text-cyan-400">@ {edu.institution}</span></h3>
                <p className="text-xs text-slate-400 mt-1">{new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingEdu(edu)} className="gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
                <form action={deleteEducation.bind(null, edu.id)}>
                  <Button type="submit" variant="danger" size="sm" className="gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}