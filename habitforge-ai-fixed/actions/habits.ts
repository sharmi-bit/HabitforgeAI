"use server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteHabitAction(habitId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("habits").update({ is_active: false }).eq("id", habitId).eq("user_id", user.id);
  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function reorderHabitsAction(habitIds: string[]) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await Promise.all(
    habitIds.map((id, index) =>
      supabase.from("habits").update({ order_index: index }).eq("id", id).eq("user_id", user.id)
    )
  );
  revalidatePath("/habits");
  revalidatePath("/dashboard");
}
