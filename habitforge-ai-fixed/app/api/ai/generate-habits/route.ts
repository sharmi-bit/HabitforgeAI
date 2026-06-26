import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildHabitGenerationPrompt } from "@/lib/claude/prompts";
import { parseHabitGenerationResponse } from "@/lib/claude/parsers";
import { generateResponse } from "@/lib/ai/aiService";
import { generateHabitsSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = generateHabitsSchema.parse(await request.json());

    const { data: profile } = await supabase
      .from("profiles")
      .select("skill_level,daily_time_hours,occupation")
      .eq("id", user.id)
      .single();

    const prompt = buildHabitGenerationPrompt({
      goalTitle: body.goal_title,
      goalDescription: body.goal_description,
      category: body.category,
      skillLevel: profile?.skill_level ?? body.skill_level,
      dailyHours: profile?.daily_time_hours ?? body.daily_hours,
      deadline: body.deadline,
      occupation: profile?.occupation ?? undefined,
    });

    const content = await generateResponse(prompt, { maxTokens: 1024 });
    const plan = parseHabitGenerationResponse(content);

    const { data: generation } = await supabase
      .from("ai_generations")
      .insert({
        user_id: user.id,
        goal_id: body.goal_id,
        input_data: body as Record<string, unknown>,
        output_data: plan as unknown as Record<string, unknown>,
        model_used: process.env.AI_MODEL ?? process.env.AI_PROVIDER ?? "cloud",
        tokens_used: null,
      })
      .select()
      .single();

    if (plan.habits?.length) {
      const habitsToInsert = plan.habits.map((h, i) => ({
        user_id: user.id,
        goal_id: body.goal_id,
        title: h.title,
        description: h.description,
        time_of_day: h.time_of_day,
        duration_min: h.duration_min,
        frequency: h.frequency,
        order_index: i,
      }));
      await supabase.from("habits").insert(habitsToInsert);
    }

    return NextResponse.json({
      generation_id: generation?.id,
      plan,
      habits_created: plan.habits?.length ?? 0,
    });
  } catch (err) {
    console.error("generate-habits error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
