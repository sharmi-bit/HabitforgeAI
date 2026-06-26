import { createServerClient } from "@/lib/supabase/server";
import type { Profile, Subscription, Streak } from "@/types";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data as Profile | null;
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("subscriptions").select("*").eq("user_id", userId).single();
  return data as Subscription | null;
}

export async function getStreak(userId: string): Promise<Streak | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.from("streaks").select("*").eq("user_id", userId).single();
  return data as Streak | null;
}

export async function getFullUserContext(userId: string) {
  const [profile, subscription, streak] = await Promise.all([
    getProfile(userId),
    getSubscription(userId),
    getStreak(userId),
  ]);
  return { profile, subscription, streak };
}
