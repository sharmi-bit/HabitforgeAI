import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildCoachSystemPrompt } from "@/lib/claude/prompts";
import { generateResponse } from "@/lib/ai/aiService";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { message } = await request.json() as { message?: string };
    if (!message?.trim())
      return new Response(JSON.stringify({ error: "Message required" }), { status: 400 });

    const [goalsResult, statsResult, streakResult] = await Promise.all([
      supabase.from("goals").select("title").eq("user_id", user.id).eq("status", "active"),
      supabase.from("habit_logs").select("status").eq("user_id", user.id)
        .gte("log_date", new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]),
      supabase.from("streaks").select("current_streak").eq("user_id", user.id).single(),
    ]);

    const logs = statsResult.data ?? [];
    const completed = logs.filter((l) => l.status === "completed").length;
    const completionRate = logs.length > 0 ? Math.round((completed / logs.length) * 100) : 0;

    const { data: profile } = await supabase
      .from("profiles").select("full_name").eq("id", user.id).single();

    // Only title is needed for the prompt — map to satisfy Goal[] shape minimally
    const goalTitles = (goalsResult.data ?? []).map((g) => ({ title: g.title as string }));

    const systemPrompt = buildCoachSystemPrompt({
      userName: profile?.full_name as string ?? "there",
      goals: goalTitles as { title: string }[],
      recentCompletionRate: completionRate,
      currentStreak: streakResult.data?.current_streak ?? 0,
    });

    await supabase.from("coach_messages")
      .insert({ user_id: user.id, role: "user", content: message });

    const responseText = await generateResponse(message, {
      systemPrompt,
      maxTokens: 512,
    });

    await supabase.from("coach_messages")
      .insert({ user_id: user.id, role: "assistant", content: responseText });

    return new Response(responseText, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("coach error:", err);
    return new Response(
      JSON.stringify({ error: "AI service unavailable. Check AI_PROVIDER and AI_API_KEY in .env." }),
      { status: 500 }
    );
  }
}
