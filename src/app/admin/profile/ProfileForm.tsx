"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ProfileForm({ profile }: { profile: any }) {
  const [successMessage, setSuccessMessage] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setSuccessMessage(false);

    try {
      await updateProfile(formData);
      setSuccessMessage(true);
      
      // Hide the success banner after 4 seconds
      setTimeout(() => {
        setSuccessMessage(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-6">
        
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              defaultValue={profile?.fullName || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Professional Title</label>
            <input
              type="text"
              name="professionalTitle"
              defaultValue={profile?.professionalTitle || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              defaultValue={profile?.heroTitle || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Short Intro</label>
            <input
              type="text"
              name="shortIntro"
              defaultValue={profile?.shortIntro || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Hero Subtitle / Tagline</label>
          <textarea
            name="heroSubtitle"
            rows={2}
            defaultValue={profile?.heroSubtitle || ""}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">About Me Description</label>
          <textarea
            name="aboutMe"
            rows={4}
            defaultValue={profile?.aboutMe || ""}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Current Location</label>
            <input
              type="text"
              name="currentLocation"
              defaultValue={profile?.currentLocation || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              defaultValue={profile?.yearsOfExperience || 0}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              defaultValue={profile?.contactEmail || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Availability Status</label>
          <select
            name="availabilityStatus"
            defaultValue={profile?.availabilityStatus || "OPEN_TO_OFFERS"}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BUSY">BUSY</option>
            <option value="OPEN_TO_OFFERS">OPEN_TO_OFFERS</option>
            <option value="NOT_LOOKING">NOT_LOOKING</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Profile Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}