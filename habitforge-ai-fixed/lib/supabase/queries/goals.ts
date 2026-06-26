import { createServerClient } from "@/lib/supabase/server";
import type { Goal } from "@/types";

export async function getGoals(userId: string): Promise<Goal[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getActiveGoals(userId: string): Promise<Goal[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getGoalById(goalId: string, userId: string): Promise<Goal | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function getActiveGoalCount(userId: string): Promise<number> {
  const supabase = await createServerClient();
  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");
  return count ?? 0;
}
