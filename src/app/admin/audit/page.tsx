import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, Activity, UserCheck, Clock } from "lucide-react";

export default async function AdminAuditPage() {
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Security & Audit Logs</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time trail of administrative actions, data changes, and system events.</p>
      </div>

      <div className="space-y-3">
        {auditLogs.length === 0 ? (
          <Card className="text-center py-12 text-slate-400">
            No audit logs recorded yet.
          </Card>
        ) : (
          auditLogs.map((log) => (
            <Card key={log.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">{log.action}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {log.entity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Executed by <strong className="text-slate-200">{log.user?.name || log.user?.email || "System"}</strong> on ID: <span className="font-mono">{log.entityId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}