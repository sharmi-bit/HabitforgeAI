"use server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { goalSchema } from "@/lib/validations";
import type { GoalStatus } from "@/types";

export async function deleteGoalAction(goalId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("goals").delete().eq("id", goalId).eq("user_id", user.id);
  revalidatePath("/goals");
  redirect("/goals");
}

export async function updateGoalStatusAction(goalId: string, status: GoalStatus) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("goals").update({ status, updated_at: new Date().toISOString() }).eq("id", goalId).eq("user_id", user.id);
  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
}

export async function updateGoalProgressAction(goalId: string, progress: number) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("goals").update({ progress, updated_at: new Date().toISOString() }).eq("id", goalId).eq("user_id", user.id);

  await supabase.from("goal_progress").insert({
    user_id: user.id,
    goal_id: goalId,
    progress_percent: progress,
  });

  revalidatePath(`/goals/${goalId}`);
}
