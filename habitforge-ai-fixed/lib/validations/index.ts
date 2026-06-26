import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["placement", "fitness", "learning", "career", "health", "finance", "personal", "other"]),
  deadline: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  difficulty: z.enum(["easy", "moderate", "hard", "extreme"]),
});

export const habitSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(300).optional(),
  time_of_day: z.enum(["morning", "afternoon", "evening", "anytime"]),
  duration_min: z.number().min(5).max(480),
  frequency: z.enum(["daily", "weekdays", "weekends", "weekly"]),
  goal_id: z.string().uuid().optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  occupation: z.string().max(100).optional(),
  skill_level: z.enum(["beginner", "intermediate", "advanced"]),
  daily_time_hours: z.number().min(0.5).max(16),
});

export const generateHabitsSchema = z.object({
  goal_id: z.string().uuid(),
  goal_title: z.string().min(3),
  goal_description: z.string().optional(),
  category: z.string(),
  skill_level: z.string(),
  daily_hours: z.number().min(0.5).max(16),
  deadline: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type HabitInput = z.infer<typeof habitSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type GenerateHabitsInput = z.infer<typeof generateHabitsSchema>;
