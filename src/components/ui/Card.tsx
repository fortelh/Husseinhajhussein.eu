import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}