import { createServerClient } from "@/lib/supabase/server";

export interface DailyCompletionData {
  date: string;
  completed: number;
  total: number;
  rate: number;
}

export async function getCompletionTrend(userId: string, days = 30): Promise<DailyCompletionData[]> {
  const supabase = await createServerClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("habit_logs")
    .select("log_date, status")
    .eq("user_id", userId)
    .gte("log_date", since.toISOString().split("T")[0]);

  const byDate = new Map<string, { completed: number; total: number }>();
  (data ?? []).forEach((log) => {
    const existing = byDate.get(log.log_date) ?? { completed: 0, total: 0 };
    existing.total++;
    if (log.status === "completed") existing.completed++;
    byDate.set(log.log_date, existing);
  });

  return Array.from(byDate.entries())
    .map(([date, { completed, total }]) => ({
      date,
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getOverallStats(userId: string) {
  const supabase = await createServerClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [logsResult, habitsResult, goalsResult, streakResult] = await Promise.all([
    supabase.from("habit_logs").select("status").eq("user_id", userId).gte("log_date", thirtyDaysAgo.toISOString().split("T")[0]),
    supabase.from("habits").select("id", { count: "exact" }).eq("user_id", userId).eq("is_active", true),
    supabase.from("goals").select("id", { count: "exact" }).eq("user_id", userId).eq("status", "active"),
    supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).single(),
  ]);

  const logs = logsResult.data ?? [];
  const completed = logs.filter((l) => l.status === "completed").length;
  const total = logs.length;

  return {
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalHabits: habitsResult.count ?? 0,
    activeGoals: goalsResult.count ?? 0,
    currentStreak: streakResult.data?.current_streak ?? 0,
    longestStreak: streakResult.data?.longest_streak ?? 0,
  };
}
