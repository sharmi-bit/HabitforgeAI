// AI-generated plan types (returned by the generate-habits API)

export interface DailyActivity {
  activity: string;
  duration_min: number;
  description: string;
}

export interface DailyPlan {
  morning: DailyActivity[];
  afternoon: DailyActivity[];
  evening: DailyActivity[];
}

export interface WeeklySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface MonthlyMilestone {
  month: number;
  focus: string;
  milestones: string[];
  expected_outcome: string;
}

export interface SuccessMetric {
  metric: string;
  target: string;
  measurement: string;
}

export interface GeneratedHabit {
  title: string;
  description: string;
  time_of_day: "morning" | "afternoon" | "evening" | "anytime";
  duration_min: number;
  frequency: "daily" | "weekdays" | "weekends" | "weekly";
}

export interface GeneratedPlan {
  daily_plan: DailyPlan;
  weekly_schedule: WeeklySchedule;
  monthly_roadmap: MonthlyMilestone[];
  success_metrics: SuccessMetric[];
  habits: GeneratedHabit[];
  coach_note: string;
}
