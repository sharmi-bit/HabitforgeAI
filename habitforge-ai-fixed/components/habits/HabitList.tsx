import { ListChecks, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Habit, HabitTimeOfDay } from "@/types";
import { formatDuration, capitalize } from "@/lib/utils/format";

export function HabitList({ habits }: { habits: Habit[] }) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No habits yet"
        description="Generate an AI habit plan from your goal to create habits automatically."
      />
    );
  }

  const grouped = habits.reduce((acc, h) => {
    const k = h.time_of_day;
    if (!acc[k]) acc[k] = [];
    acc[k].push(h);
    return acc;
  }, {} as Record<HabitTimeOfDay, Habit[]>);

  const order: HabitTimeOfDay[] = ["morning", "afternoon", "evening", "anytime"];

  return (
    <div className="space-y-4">
      {order.filter(k => grouped[k]?.length).map(period => (
        <div key={period}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 capitalize">{period}</h4>
          <div className="space-y-2">
            {grouped[period].map((habit: Habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-3.5 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{habit.title}</p>
                  {habit.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{habit.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />{formatDuration(habit.duration_min)}
                  </span>
                  <Badge variant="outline" className="text-xs capitalize">{habit.frequency}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
