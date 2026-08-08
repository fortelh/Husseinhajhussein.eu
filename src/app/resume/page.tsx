import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, GraduationCap, Cpu, FileText, Download, ExternalLink, Calendar, MapPin } from "lucide-react";

export default async function PublicResumePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  const educations = await prisma.education.findMany({
    orderBy: { startDate: "desc" },
  });

  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { proficiencyLevel: "desc" }],
  });

  const documents = await prisma.document.findMany({
    where: { isPublic: true },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Resume Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
              <FileText className="w-4 h-4" />
              Curriculum Vitae
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Professional Resume</h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Verified career history, academic background, competencies, and official credentials.
            </p>
          </div>

          {documents.find((d) => d.category === "CV") && (
            <div>
              <a
                href={documents.find((d) => d.category === "CV")?.media.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Official CV
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            Work Experience
          </h2>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card key={exp.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                    <p className="text-cyan-400 font-medium text-sm">@ {exp.company}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(exp.startDate).getFullYear()} - {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-2 border-t border-slate-800/80">
                    {exp.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            Education & Degrees
          </h2>

          <div className="space-y-4">
            {educations.map((edu) => (
              <Card key={edu.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-cyan-400 font-medium text-sm">@ {edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800/80">
                    {edu.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Skills Matrix Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Skills & Expertise
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{skill.name}</h3>
                  <span className="text-xs font-mono text-cyan-400">{skill.proficiencyLevel}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${skill.proficiencyLevel}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>{skill.category}</span>
                  <span>{skill.yearsOfExperience} yrs exp</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Credentials & Certificates Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Official Credentials & Certificates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">{doc.name}</h3>
                  <p className="text-xs font-mono text-cyan-400">{doc.category}</p>
                </div>
                <a
                  href={doc.media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
                >
                  View File
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}