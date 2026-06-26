import Link from "next/link";
import { Calendar, ChevronRight, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/types";
import { getCategoryColor, getPriorityColor, capitalize } from "@/lib/utils/format";
import { getDaysUntil, formatDate } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export function GoalCard({ goal }: { goal: Goal }) {
  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;

  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{goal.title}</h3>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{goal.description}</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge className={cn("text-xs", getCategoryColor(goal.category))} variant="outline">
              {capitalize(goal.category)}
            </Badge>
            <Badge variant="outline" className={cn("text-xs gap-1", getPriorityColor(goal.priority))}>
              <Flag className="w-3 h-3" /> {capitalize(goal.priority)}
            </Badge>
            {goal.status !== "active" && (
              <Badge variant="secondary" className="text-xs capitalize">{goal.status}</Badge>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-1.5" />
          </div>

          {goal.deadline && (
            <div className={cn("flex items-center gap-1.5 text-xs", isOverdue ? "text-destructive" : "text-muted-foreground")}>
              <Calendar className="w-3 h-3" />
              <span>{isOverdue ? `Overdue by ${Math.abs(daysLeft!)} days` : `${daysLeft} days left · ${formatDate(goal.deadline)}`}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
