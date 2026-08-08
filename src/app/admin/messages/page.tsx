import { prisma } from "@/lib/prisma";
import { toggleReadStatus, deleteMessage } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Trash2, CheckCircle2, Circle, ExternalLink } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Client & Recruiter Inquiries</h1>
        <p className="text-slate-400 text-sm mt-1">Review contact form submissions, project proposals, and messages from your portfolio.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card className="text-center py-12 text-slate-400">
            No contact messages received yet.
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={`space-y-4 transition-all ${msg.read ? "opacity-75 border-slate-800" : "border-cyan-500/40 bg-slate-900/40"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">{msg.subject}</h3>
                    {!msg.read && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    From <strong className="text-slate-200">{msg.name}</strong> (&lt;{msg.email}&gt;) • {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <form action={toggleReadStatus.bind(null, msg.id, msg.read)}>
                    <Button type="submit" variant="secondary" size="sm" className="gap-1.5">
                      {msg.read ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {msg.read ? "Mark Unread" : "Mark Read"}
                    </Button>
                  </form>
                  <form action={deleteMessage.bind(null, msg.id)}>
                    <Button type="submit" variant="danger" size="sm" className="gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-slate-300 text-sm whitespace-pre-line">
                {msg.message}
              </div>

              {msg.attachmentUrl && (
                <div className="pt-2">
                  <a
                    href={msg.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    View Attachment
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}