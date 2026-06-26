import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getProfile } from "@/lib/supabase/queries/profile";

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);

  return (
    <div>
      <Header title="Profile" description="Manage your account and preferences" />
      <div className="p-6 max-w-2xl mx-auto">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
