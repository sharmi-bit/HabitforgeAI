"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Habit } from "@/types";

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchHabits = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("order_index");
    setHabits(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  return { habits, loading, refetch: fetchHabits };
}
