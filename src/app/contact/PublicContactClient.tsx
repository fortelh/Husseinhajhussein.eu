"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { submitContactMessage } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Send, Mail, CheckCircle2 } from "lucide-react";

export default function PublicContactClient() {
  const [state, formAction] = useFormState(submitContactMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
            <Mail className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Contact & Inquiries</h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Have an engineering project proposal, technical consultation request, or employment opportunity? Send a message directly.
          </p>
        </div>

        {state?.message && (
          <div className={`p-4 rounded-xl flex items-center gap-2 text-sm border ${
            state.success 
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300" 
              : "bg-rose-950/80 border-rose-500/50 text-rose-300"
          }`}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <Card>
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Dr. Alexander Wright"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="alexander@corporate.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Subject / Topic</label>
              <input
                type="text"
                name="subject"
                placeholder="Microgrid Automation Architecture Review"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Message</label>
              <textarea
                name="message"
                rows={5}
                placeholder="Provide details regarding scope, timeline, or consultation requirements..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" />
                Send Inquiry
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}