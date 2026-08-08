import { getExperiences } from "@/lib/portfolio-data";
import { Briefcase, Calendar } from "lucide-react";

export default async function ExperienceSection() {
  const experiences = await getExperiences();

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto py-20 px-6 sm:px-12">
      <div className="flex items-center gap-3 mb-12">
        <Briefcase className="w-6 h-6 text-cyan-400" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Work Experience</h2>
      </div>

      <div className="relative border-l border-slate-800 ml-4 space-y-12">
        {experiences.map((exp: any) => {
          const startDate = new Date(exp.startDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          const endDate = exp.current
            ? "Present"
            : exp.endDate
            ? new Date(exp.endDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Present";

          return (
            <div key={exp.id} className="relative pl-8 group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-slate-950 group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/50 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-cyan-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 w-fit">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {startDate} — {endDate}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                    {exp.highlights.map((highlight: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">▸</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}