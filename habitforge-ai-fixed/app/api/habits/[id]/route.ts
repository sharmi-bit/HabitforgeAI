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

    const { data: habit } = await supabase.from("habits").select("id").eq("id", id).eq("user_id", user.id).single();
    if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

    const today = getTodayDate();
    const { error } = await supabase.from("habit_logs").upsert({
      user_id: user.id,
      habit_id: id,
      log_date: today,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    }, { onConflict: "habit_id,log_date" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (status === "completed") {
      const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", user.id).single();
      if (streak) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        const alreadyToday = streak.last_active_date === today;
        const isConsecutive = streak.last_active_date === yesterdayStr;
        const newStreak = alreadyToday ? streak.current_streak : isConsecutive ? streak.current_streak + 1 : 1;
        await supabase.from("streaks").update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_active_date: today,
        }).eq("user_id", user.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}