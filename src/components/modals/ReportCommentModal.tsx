"use client";

import { useState } from "react";
import { Flag, X, AlertTriangle } from "lucide-react";

interface ReportCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
  visitorId?: string; // Optional if you have the logged-in visitor's ID
}

const REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Inappropriate or offensive content",
  "Off-topic discussion",
  "Other",
];

export default function ReportCommentModal({
  isOpen,
  onClose,
  commentId,
  visitorId,
}: ReportCommentModalProps) {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reasonToSubmit = selectedReason === "Other" ? customReason : selectedReason;

      const res = await fetch("/api/comments/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          visitorId: visitorId || null,
          reason: reasonToSubmit,
        }),
      });

      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          setIsSubmitting(false);
          onClose();
        }, 1500);
      } else {
        alert("Failed to submit report. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Flag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Report Comment</h3>
            <p className="text-xs text-slate-400">Help us keep the community safe and clean.</p>
          </div>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <p className="font-semibold text-emerald-400">Report Submitted</p>
            <p className="text-xs text-slate-400">Thank you. An admin will review this shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Select a reason:</label>
              {REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === reason
                      ? "bg-cyan-500/10 border-cyan-500/40 text-white"
                      : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-cyan-400"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === "Other" && (
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Please specify:</label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Provide additional details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-mono rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}