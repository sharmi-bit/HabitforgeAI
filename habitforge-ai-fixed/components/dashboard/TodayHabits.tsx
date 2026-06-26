"use client";
import { useState } from "react";
import { CheckCircle2, Circle, SkipForward, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import type { Habit, HabitLog } from "@/types";
import { formatDuration } from "@/lib/utils/format";

interface TodayHabitsProps {
  habits: (Habit & { log?: HabitLog })[];
}

export function TodayHabits({ habits }: TodayHabitsProps) {
  const [logs, setLogs] = useState<Record<string, string>>(
    Object.fromEntries(habits.filter(h => h.log).map(h => [h.id, h.log!.status]))
  );
  const [loading, setLoading] = useState<string | null>(null);

  const logHabit = async (habitId: string, status: "completed" | "skipped") => {
    setLoading(habitId);
    try {
      const res = await fetch(`/api/habits/${habitId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setLogs(prev => ({ ...prev, [habitId]: status }));
      toast.success(status === "completed" ? "Habit completed! 🎉" : "Habit skipped");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const completed = Object.values(logs).filter(s => s === "completed").length;
  const total = habits.length;

  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Today&apos;s Habits</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No habits yet.</p>
            <a href="/goals/new" className="text-primary text-sm hover:underline">Create a goal to get started →</a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Today&apos;s Habits</CardTitle>
        <span className="text-sm text-muted-foreground font-medium">{completed}/{total} done</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {habits.map(habit => {
          const status = logs[habit.id] as string | undefined;
          const isDone = status === "completed";
          const isSkipped = status === "skipped";
          const isLoading = loading === habit.id;
          return (
            <div key={habit.id} className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all",
              isDone && "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
              isSkipped && "opacity-50",
              !isDone && !isSkipped && "hover:bg-accent/50"
            )}>
              <div>
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                  : <Circle className="w-5 h-5 text-muted-foreground" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", isDone && "line-through text-muted-foreground")}>{habit.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatDuration(habit.duration_min)}</span>
                  <Badge variant="outline" className="text-xs py-0 h-4 capitalize">{habit.time_of_day}</Badge>
                </div>
              </div>
              {!isDone && !isSkipped && (
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => logHabit(habit.id, "skipped")} disabled={!!isLoading}>
                    <SkipForward className="w-3 h-3" />
                  </Button>
                  <Button size="sm" className="h-7 px-3 text-xs" onClick={() => logHabit(habit.id, "completed")} disabled={!!isLoading}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Done"}
                  </Button>
                </div>
              )}
              {(isDone || isSkipped) && status && (
                <Badge variant={isDone ? "default" : "secondary"} className="shrink-0 capitalize text-xs">{status}</Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
