// Subscription system removed — all features are free for every user.
export type PlanFeature = "goals" | "ai_generation" | "ai_coach" | "analytics";

export interface PlanCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}

export async function checkPlanLimit(_userId: string, _feature: PlanFeature): Promise<PlanCheckResult> {
  return { allowed: true };
}
