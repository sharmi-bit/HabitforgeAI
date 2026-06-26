// ─── Goal ────────────────────────────────────────────────────────────────────
export type GoalStatus = "active" | "completed" | "archived" | "paused";
export type GoalCategory =
  | "placement" | "fitness" | "learning" | "career"
  | "health" | "finance" | "personal" | "other";
export type GoalPriority = "low" | "medium" | "high" | "critical";
export type GoalDifficulty = "easy" | "moderate" | "hard" | "extreme";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  priority: GoalPriority;
  difficulty: GoalDifficulty;
  status: GoalStatus;
  progress: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Habit ───────────────────────────────────────────────────────────────────
export type HabitTimeOfDay = "morning" | "afternoon" | "evening" | "anytime";
export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly";

export interface Habit {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  time_of_day: HabitTimeOfDay;
  duration_min: number;
  frequency: HabitFrequency;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── HabitLog ────────────────────────────────────────────────────────────────
export type HabitLogStatus = "completed" | "skipped" | "missed";

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  log_date: string;
  status: HabitLogStatus;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  occupation: string | null;
  skill_level: SkillLevel;
  daily_time_hours: number;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Subscription ────────────────────────────────────────────────────────────
export type SubscriptionPlan = "free" | "premium";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Streak ──────────────────────────────────────────────────────────────────
export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

// ─── CoachMessage ────────────────────────────────────────────────────────────
export type CoachRole = "user" | "assistant";

export interface CoachMessage {
  id: string;
  user_id: string;
  role: CoachRole;
  content: string;
  tokens_used: number | null;
  created_at: string;
}

// ─── AIGeneration ────────────────────────────────────────────────────────────
export interface AIGeneration {
  id: string;
  user_id: string;
  goal_id: string | null;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  model_used: string;
  tokens_used: number | null;
  created_at: string;
}
