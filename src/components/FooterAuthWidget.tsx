"use client";

import { useState } from "react";
import VisitorAuthModal from "./VisitorAuthModal";
import EditProfileModal from "./EditProfileModal";

export default function FooterAuthWidget({ visitor }: { visitor: any }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Profile Picture / Avatar */}
      <div 
        onClick={() => {
          if (visitor) {
            setIsEditOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors"
      >
        {visitor?.avatarUrl ? (
          <img src={visitor.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-cyan-400">
            {visitor ? visitor.firstName.charAt(0) : "?"}
          </span>
        )}
      </div>

      {/* Name or Sign In Button */}
      <div>
        {visitor ? (
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-xs font-bold text-white hover:text-cyan-400 transition-colors text-left"
          >
            {visitor.firstName} {visitor.lastName}
          </button>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
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