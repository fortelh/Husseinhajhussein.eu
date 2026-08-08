"use client";

import { useState } from "react";
import { LogOut, Shield } from "lucide-react";
import VisitorAuthModal from "./VisitorAuthModal";
import EditProfileModal from "./EditProfileModal";

export default function HeaderAuthWidget({ visitor }: { visitor: any }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/visitor/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Admin Button (Only visible if the logged in user is an ADMIN) */}
      {visitor?.role === "ADMIN" && (
        <a
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl transition-colors shadow-lg"
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </a>
      )}

      {/* Profile Picture / Avatar (Clickable to edit profile if signed in, or sign in if logged out) */}
      <div 
        onClick={() => {
          if (visitor) {
            setIsEditOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors shadow-lg shrink-0"
      >
        {visitor?.avatarUrl ? (
          visitor.avatarUrl.startsWith("http") || visitor.avatarUrl.startsWith("/") ? (
            <img src={visitor.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-base">{visitor.avatarUrl}</span>
          )
        ) : (
          <span className="text-xs font-bold text-cyan-400">
            {visitor ? visitor.firstName.charAt(0) : "👤"}
          </span>
        )}
      </div>

      {/* Name / Logout (if signed in) or Sign In Button (if logged out) */}
      <div>
        {visitor ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="text-xs font-bold text-white hover:text-cyan-400 transition-colors text-left"
            >
              {visitor.firstName} {visitor.lastName}
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors pl-2 border-l border-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Modals */}
      <VisitorAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          window.location.reload();
        }}
      />

      {visitor && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          visitor={visitor}
        />
      )}
    </div>
  );
}
