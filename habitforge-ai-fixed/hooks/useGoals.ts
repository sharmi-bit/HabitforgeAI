"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Goal } from "@/types";

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setGoals(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const activeGoals = goals.filter(g => g.status === "active");

  return { goals, activeGoals, loading, refetch: fetchGoals };
}
