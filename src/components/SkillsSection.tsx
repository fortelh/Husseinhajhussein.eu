import { getSkills } from "@/lib/portfolio-data";
import { Cpu } from "lucide-react";

export default async function SkillsSection() {
  const skills = await getSkills();

  if (!skills || skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section className="max-w-5xl mx-auto py-20 px-6 sm:px-12 border-t border-slate-800/80">
      <div className="flex items-center gap-3 mb-12">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Skills & Expertise</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(groupedSkills).map(([category, catSkills]: [string, any]) => (
          <div key={category} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-wider text-xs">
              {category.replace(/_/g, " ")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-200 font-medium hover:border-cyan-500/40 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}