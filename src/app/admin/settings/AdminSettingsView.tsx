"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, ShieldPlus, Trash2, Edit3, LogOut, UserCheck, UserX, ShieldAlert, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { Role } from "@prisma/client";
import {
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  createVisitorAction,
  updateVisitorAction,
  toggleRoleAction,
  deleteVisitorAction,
  terminateSessionAction,
} from "./actions";

// 1. Create a tiny helper component for the loading states
function SubmitButton({ defaultText, pendingText }: { defaultText: string; pendingText: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : defaultText}
    </Button>
  );
}

export default function AdminSettingsView({ adminLoginUsers, adminCommunityUsers, standardUsers, currentEmail }: any) {
  // 2. Change useActionState to useFormState and REMOVE the 3rd 'pending' parameter
  const [visitorState, visitorAction] = useFormState(createVisitorAction, null as any);
  const [adminState, adminAction] = useFormState(createAdminUserAction, null as any);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            Users & Credentials Management
          </h1>
          <p className="text-slate-400 text-sm">Manage control panel login credentials, admin community users, and regular visitors.</p>
        </div>

        {/* Terminate Session Button */}
        <form action={terminateSessionAction}>
          <Button type="submit" variant="danger" className="gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20">
            <LogOut className="w-4 h-4" /> Terminate Session
          </Button>
        </form>
      </div>

      {/* ========================================================
          SECTION 1: ADMIN LOGIN USER (Standalone Control Panel Credentials)
         ======================================================== */}
      <Card className="space-y-6 border-cyan-500/40 bg-slate-900/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-cyan-400" /> Admin Login Credentials ({adminLoginUsers?.length || 0})
        </h2>
        <p className="text-xs text-slate-400 -mt-4">Standalone system credentials used specifically to log into the admin dashboard.</p>
        
        <div className="space-y-4">
          {!adminLoginUsers || adminLoginUsers.length === 0 ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm space-y-1">
              <p className="font-semibold">⚠️ No Admin Login Credentials Found!</p>
              <p className="text-xs text-amber-200/80">Use the form at the very bottom to add a standalone login credential.</p>
            </div>
          ) : (
            adminLoginUsers.map((adm: any) => (
              <div key={adm.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <form action={updateAdminUserAction} className="space-y-3">
                  <input type="hidden" name="id" value={adm.id} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Admin Username / Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={adm.email}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        New Password <span className="text-slate-600 font-normal">(Leave blank)</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-cyan-400">
                      {adm.email === currentEmail ? "(Current Logged-in Session)" : ""}
                    </span>
                    <SubmitButton defaultText="Save Changes" pendingText="Saving..." />
                  </div>
                </form>

                {adminLoginUsers.length > 1 && (
                  <form action={deleteAdminUserAction} className="flex justify-end pt-2 border-t border-slate-900">
                    <input type="hidden" name="id" value={adm.id} />
                    <button type="submit" className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Revoke Credential Access
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </Card>


      {/* ========================================================
          SECTION 2: ADMIN COMMUNITY USERS (Visitor Table - ADMIN Role)
         ======================================================== */}
      <Card className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" /> Admin Community Users ({adminCommunityUsers?.length || 0})
        </h2>
        <p className="text-xs text-slate-400 -mt-4">Community member accounts that possess administrative privileges.</p>

        <div className="space-y-4">
          {!adminCommunityUsers || adminCommunityUsers.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No admin community users found.</p>
          ) : (
            adminCommunityUsers.map((usr: any) => (
              <div key={usr.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <form action={updateVisitorAction} className="space-y-3">
                  <input type="hidden" name="id" value={usr.id} />
                  <input type="hidden" name="role" value={usr.role} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">First Name</label>
                      <input type="text" name="firstName" defaultValue={usr.firstName || ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" required />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Last Name</label>
                      <input type="text" name="lastName" defaultValue={usr.lastName || ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Email</label>
                      <input type="email" name="email" defaultValue={usr.email} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Date of Birth</label>
                      <input type="date" name="dateOfBirth" defaultValue={usr.dateOfBirth ? new Date(usr.dateOfBirth).toISOString().split("T")[0] : ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        New Password <span className="text-slate-600 font-normal">(Leave blank)</span>
                      </label>
                      <input type="password" name="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-slate-500">Joined: {new Date(usr.createdAt).toLocaleDateString()}</span>
                    <SubmitButton defaultText="Save Changes" pendingText="Saving..." />
                  </div>
                </form>

                {/* Flip Role & Delete Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <form action={toggleRoleAction}>
                    <input type="hidden" name="id" value={usr.id} />
                    <input type="hidden" name="currentRole" value={usr.role} />
                    <button type="submit" className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                      <ShieldAlert className="w-3.5 h-3.5" /> Demote to Regular User
                    </button>
                  </form>

                  <form action={deleteVisitorAction}>
                    <input type="hidden" name="id" value={usr.id} />
                    <button type="submit" className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete User
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>


      {/* ========================================================
          SECTION 3: VISITOR COMMUNITY USERS (Visitor Table - USER Role)
         ======================================================== */}
      <Card className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserX className="w-5 h-5 text-emerald-400" /> Visitor Community Users ({standardUsers?.length || 0})
        </h2>
        <p className="text-xs text-slate-400 -mt-4">Standard community visitor accounts.</p>

        <div className="space-y-4">
          {!standardUsers || standardUsers.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No standard visitor users registered yet.</p>
          ) : (
            standardUsers.map((usr: any) => (
              <div key={usr.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <form action={updateVisitorAction} className="space-y-3">
                  <input type="hidden" name="id" value={usr.id} />
                  <input type="hidden" name="role" value={usr.role} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">First Name</label>
                      <input type="text" name="firstName" defaultValue={usr.firstName || ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" required />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Last Name</label>
                      <input type="text" name="lastName" defaultValue={usr.lastName || ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Email</label>
                      <input type="email" name="email" defaultValue={usr.email} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Date of Birth</label>
                      <input type="date" name="dateOfBirth" defaultValue={usr.dateOfBirth ? new Date(usr.dateOfBirth).toISOString().split("T")[0] : ""} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                        New Password <span className="text-slate-600 font-normal">(Leave blank)</span>
                      </label>
                      <input type="password" name="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-mono text-slate-500">Joined: {new Date(usr.createdAt).toLocaleDateString()}</span>
                    <SubmitButton defaultText="Save Changes" pendingText="Saving..." />
                  </div>
                </form>

                {/* Flip Role & Delete Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <form action={toggleRoleAction}>
                    <input type="hidden" name="id" value={usr.id} />
                    <input type="hidden" name="currentRole" value={usr.role} />
                    <button type="submit" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                      <UserCheck className="w-3.5 h-3.5" /> Promote to Admin Role
                    </button>
                  </form>

                  <form action={deleteVisitorAction}>
                    <input type="hidden" name="id" value={usr.id} />
                    <button type="submit" className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete User
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>


      {/* ========================================================
          SECTION 4: CREATION FORMS (Both Types with Feedback Banners)
         ======================================================== */}
      
      {/* 4A. Create Community User */}
      <Card className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
          <ShieldPlus className="w-5 h-5 text-emerald-400" /> Create New Community User
        </h2>

        {visitorState?.message && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${visitorState.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'}`}>
            {visitorState.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{visitorState.message}</span>
          </div>
        )}

        <form action={visitorAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">First Name</label>
              <input type="text" name="firstName" placeholder="John" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Email</label>
              <input type="email" name="email" placeholder="user@domain.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Date of Birth</label>
              <input type="date" name="dateOfBirth" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Secure Password</label>
              <input type="password" name="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Account Role</label>
              <select name="role" defaultValue={Role.USER} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white">
                <option value={Role.USER}>USER (Standard Visitor)</option>
                <option value={Role.ADMIN}>ADMIN (Community Admin)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <SubmitButton defaultText="Create Community User" pendingText="Creating..." />
          </div>
        </form>
      </Card>


      {/* 4B. Create Standalone Control Panel Admin Credential */}
      <Card className="space-y-6 border-cyan-500/30">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
          <KeyRound className="w-5 h-5 text-cyan-400" /> Create Control Panel Admin Credential
        </h2>

        {adminState?.message && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${adminState.success ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'}`}>
            {adminState.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{adminState.message}</span>
          </div>
        )}

        <form action={adminAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Admin Username / Email</label>
              <input type="email" name="email" placeholder="admin@domain.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" required />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Secure Password</label>
              <input type="password" name="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" required />
            </div>
          </div>

          <div className="flex justify-end pt-2">
             <SubmitButton defaultText="Create Admin Credential" pendingText="Creating..." />
          </div>
        </form>
      </Card>
    </div>
  );
}
