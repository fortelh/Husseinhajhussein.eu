"use client";

import { useState, useTransition } from "react";
import { adminLogin } from "./actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await adminLogin(formData);
      } catch (err: any) {
        setError(err?.message || "Login failed.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 border-slate-800">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-white">Admin Authentication</h1>
          <p className="text-xs text-slate-400">Strictly restricted access. Authorized personnel only.</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@portfolio.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              required
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Authenticate Session
          </Button>
        </form>
      </Card>
    </div>
  );
}