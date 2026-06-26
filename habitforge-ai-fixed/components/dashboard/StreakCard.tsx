import { Flame, Trophy, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "@/types";
import { getCategoryColor } from "@/lib/utils/format";
import { getDaysUntil } from "@/lib/utils/dates";
import Link from "next/link";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const milestones = [7, 30, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak) ?? 365;
  const progress = Math.min((currentStreak / nextMilestone) * 100, 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" /> Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div>
            <p className="text-4xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">current days</p>
          </div>
          <div className="ml-auto text-right">
            <div className="flex items-center gap-1 justify-end">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <p className="text-lg font-semibold">{longestStreak}</p>
            </div>
            <p className="text-xs text-muted-foreground">best</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{currentStreak} days</span>
            <span>Next: {nextMilestone} days 🔥</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

interface ActiveGoalsProps {
  goals: Goal[];
}

export function ActiveGoals({ goals }: ActiveGoalsProps) {
  if (goals.length === 0) return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Active Goals</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center py-4">
          <Link href="/goals/new" className="text-primary hover:underline">Create your first goal →</Link>
        </p>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Active Goals</CardTitle>
        <Link href="/goals" className="text-xs text-primary hover:underline">See all</Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.map(goal => {
          const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;
          return (
            <Link key={goal.id} href={`/goals/${goal.id}`}>
              <div className="p-3 rounded-lg border hover:bg-accent/50 transition-colors space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{goal.title}</p>
                    <Badge className={`text-xs mt-1 ${getCategoryColor(goal.category)}`} variant="outline">
                      {goal.category}
                    </Badge>
                  </div>
                  {daysLeft !== null && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span><span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
