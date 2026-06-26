import { Target, ListChecks, TrendingUp, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  completionRate: number;
  activeGoals: number;
  totalHabits: number;
  currentStreak: number;
}

export function StatsOverview({ completionRate, activeGoals, totalHabits, currentStreak }: StatsOverviewProps) {
  const stats = [
    { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { label: "Active Goals", value: activeGoals, icon: Target, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Active Habits", value: totalHabits, icon: ListChecks, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Current Streak", value: `${currentStreak}d`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
