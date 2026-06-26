import type { GeneratedPlan } from "@/types/ai";

export function parseHabitGenerationResponse(content: string): GeneratedPlan {
  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  try {
    return JSON.parse(cleaned) as GeneratedPlan;
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}
