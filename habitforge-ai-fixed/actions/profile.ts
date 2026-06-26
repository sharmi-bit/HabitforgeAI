"use server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: {
  full_name: string;
  occupation?: string;
  skill_level: string;
  daily_time_hours: number;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/profile");
}
