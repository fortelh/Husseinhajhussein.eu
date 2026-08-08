"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createSkill, updateSkill, deleteSkill } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Cpu, Trash2, Star, Plus, Edit2, X, CheckCircle2 } from "lucide-react";

export default function AdminSkillsClient({ initialSkills }: { initialSkills: any[] }) {
  const [editingSkill, setEditingSkill] = useState<any | null>(null);

  const [skillState, skillAction] = useFormState(
    editingSkill ? updateSkill.bind(null, editingSkill.id) : createSkill, 
    null
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (skillState?.success) {
      setSuccessMessage(skillState.message);
      setEditingSkill(null);
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [skillState]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Skills & Expertise Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your technical competencies, frameworks, and proficiency ratings.</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add / Edit Skill Form Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {editingSkill ? <Edit2 className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
            {editingSkill ? `Edit Competency: ${editingSkill.name}` : "Add Technical Competency"}
          </h2>
          {editingSkill && (
            <Button variant="outline" size="sm" onClick={() => setEditingSkill(null)} className="gap-1 text-slate-400">
              <X className="w-4 h-4" /> Cancel Editing
            </Button>
          )}
        </div>

        <form action={skillAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Skill Name</label>
              <input
                type="text"
                name="name"
                defaultValue={editingSkill?.name || ""}
                placeholder="Python / SCADA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={editingSkill?.category || ""}
                placeholder="Languages / Industrial Systems"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                name="yearsOfExperience"
                defaultValue={editingSkill ? editingSkill.yearsOfExperience : 3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Proficiency Level (0 - 100%)</label>
              <input
                type="number"
                min="1"
                max="100"
                name="proficiencyLevel"
                defaultValue={editingSkill ? editingSkill.proficiencyLevel : 90}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>
            <div className="flex items-center pt-6 gap-2">
              <input 
                type="checkbox" 
                name="featured" 
                id="featured" 
                defaultChecked={editingSkill ? editingSkill.featured : false}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500" 
              />
              <label htmlFor="featured" className="text-xs text-slate-300 font-medium">Feature on Homepage Hero/Overview</label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Short Description / Context</label>
            <input
              type="text"
              name="description"
              defaultValue={editingSkill?.description || ""}
              placeholder="Used for automation pipelines and microservices..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">{editingSkill ? "Update Skill" : "Add Skill"}</Button>
          </div>
        </form>
      </Card>

      {/* Skills Matrix List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialSkills.map((skill) => (
          <Card key={skill.id} className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">{skill.name}</h3>
                </div>
                {skill.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-300">{skill.category}</span>
                <span>•</span>
                <span>{skill.yearsOfExperience} yrs exp</span>
                <span>•</span>
                <span>{skill.proficiencyLevel}% proficiency</span>
              </div>
              {skill.description && <p className="text-xs text-slate-400">{skill.description}</p>}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingSkill(skill)} className="gap-1.5">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <form action={deleteSkill.bind(null, skill.id)}>
                <Button type="submit" variant="danger" size="sm" className="gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
