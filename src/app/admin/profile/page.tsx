import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Management</h1>
        <p className="text-slate-400 text-sm mt-1">Update your live professional identity and hero section details.</p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}