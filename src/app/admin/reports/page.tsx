import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Flag, ArrowLeft, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminReportsPage() {
  // Fetch pending reports with comment and visitor info
  const reports = await prisma.commentReport.findMany({
    where: { status: "pending" },
    include: {
      comment: {
        include: {
          visitor: true,
          project: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Server action to handle report resolution
  async function resolveReport(formData: FormData) {
    "use server";
    const reportId = formData.get("reportId") as string;
    const action = formData.get("action") as string; // "dismiss" or "delete"
    const commentId = formData.get("commentId") as string;

    if (action === "delete") {
      // 1. Update the report status to "resolved" FIRST before deleting the comment
      await prisma.commentReport.update({
        where: { id: reportId },
        data: { status: "resolved" },
      }).catch(() => {});

      // 2. Then delete the reported comment
      if (commentId) {
        await prisma.projectComment.delete({
          where: { id: commentId },
        }).catch(() => {});
      }
    } else {
      // 1. Update the report status to "dismissed"
      await prisma.commentReport.update({
        where: { id: reportId },
        data: { status: "dismissed" },
      }).catch(() => {});

      // 2. Unhide the comment so it goes back to normal
      if (commentId) {
        await prisma.projectComment.update({
          where: { id: commentId },
          data: { isHidden: false },
        }).catch(() => {});
      }
    }

    revalidatePath("/admin/reports");
    revalidatePath("/admin");
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Reported Comments</h1>
          </div>
          <p className="text-slate-400 text-sm">Review flagged community discussions and take moderation actions.</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          {reports.length} Pending Review
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="text-center py-16 space-y-3 bg-slate-900/50 border-slate-800">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            ✓
          </div>
          <h3 className="text-white font-bold text-lg">All Clear</h3>
          <p className="text-sm text-slate-400">There are no pending comment reports to review right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-slate-900 border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Reason: <span className="text-white font-bold">{report.reason}</span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Reported on: {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>

              {report.comment ? (
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>
                      Author: <strong className="text-white">{report.comment.visitor?.firstName} {report.comment.visitor?.lastName}</strong> ({report.comment.visitor?.email})
                    </span>
                    <span>
                      Project: <Link href={`/projects/${report.comment.project?.slug}`} className="text-cyan-400 hover:underline" target="_blank">{report.comment.project?.title}</Link>
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    &ldquo;{report.comment.content}&rdquo;
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">The reported comment has already been deleted.</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                {report.comment && (
                  <form action={resolveReport}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <input type="hidden" name="commentId" value={report.comment.id} />
                    <input type="hidden" name="action" value="delete" />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-mono rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Comment & Resolve
                    </button>
                  </form>
                )}

                <form action={resolveReport}>
                  <input type="hidden" name="reportId" value={report.id} />
                  {report.comment && <input type="hidden" name="commentId" value={report.comment.id} />}
                  <input type="hidden" name="action" value="dismiss" />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Dismiss Report
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}