import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getTodayDate } from "@/lib/utils/dates";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await request.json() as { status: string };
    if (!["completed", "skipped", "missed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: habit } = await supabase
      .from("habits")
      .select("id, goal_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

    const today = getTodayDate();
    const { error: logError } = await supabase.from("habit_logs").upsert({
      user_id: user.id,
      habit_id: id,
      log_date: today,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    }, { onConflict: "habit_id,log_date" });

    if (logError) return NextResponse.json({ error: logError.message }, { status: 500 });

    if (habit.goal_id) {
      const { data: allHabits } = await supabase
        .from("habits").select("id").eq("goal_id", habit.goal_id).eq("is_active", true);
      if (allHabits && allHabits.length > 0) {
        const habitIds = allHabits.map((h: { id: string }) => h.id);
        const { data: completedLogs } = await supabase
          .from("habit_logs").select("habit_id").in("habit_id", habitIds).eq("status", "completed");
        const completedIds = new Set((completedLogs ?? []).map((l: { habit_id: string }) => l.habit_id));
        const progress = Math.round((completedIds.size / allHabits.length) * 100);
        await supabase.from("goals").update({ progress }).eq("id", habit.goal_id).eq("user_id", user.id);
      }
    }

    if (status === "completed") {
      const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", user.id).single();
      if (streak) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        const alreadyToday = streak.last_active_date === today;
        const isConsecutive = streak.last_active_date === yesterdayStr;
        if (!alreadyToday) {
          const newStreak = isConsecutive ? streak.current_streak + 1 : 1;
          await supabase.from("streaks").update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, streak.longest_streak),
            last_active_date: today,
          }).eq("user_id", user.id);
        }
      } else {
        await supabase.from("streaks").insert({
          user_id: user.id, current_streak: 1, longest_streak: 1, last_active_date: today,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}