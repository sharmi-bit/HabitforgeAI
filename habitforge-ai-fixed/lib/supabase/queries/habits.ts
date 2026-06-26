import { createServerClient } from "@/lib/supabase/server";
import type { Habit, HabitLog } from "@/types";
import { getTodayDate } from "@/lib/utils/dates";

export async function getHabits(userId: string, goalId?: string): Promise<Habit[]> {
  const supabase = await createServerClient();
  let query = supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (goalId) query = query.eq("goal_id", goalId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Habit[];
}

export async function getTodayHabits(userId: string): Promise<(Habit & { log?: HabitLog })[]> {
  const supabase = await createServerClient();
  const today = getTodayDate();
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("order_index");

  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", today);

  const logMap = new Map(((logs ?? []) as HabitLog[]).map((l) => [l.habit_id, l]));
  return ((habits ?? []) as Habit[]).map((h) => ({ ...h, log: logMap.get(h.id) }));
}

export async function getHabitLogs(userId: string, days = 30): Promise<HabitLog[]> {
  const supabase = await createServerClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", since.toISOString().split("T")[0])
    .order("log_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as HabitLog[];
}
