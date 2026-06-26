import { createServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Edit, Calendar, Flag, Layers } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGoalById } from "@/lib/supabase/queries/goals";
import { getHabits } from "@/lib/supabase/queries/habits";
import { getCategoryColor, capitalize } from "@/lib/utils/format";
import { formatDate, getDaysUntil } from "@/lib/utils/dates";
import { HabitList } from "@/components/habits/HabitList";
import { GenerateHabitsButton } from "@/components/goals/GenerateHabitsButton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GoalDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [goal, habits] = await Promise.all([
    getGoalById(id, user.id),
    getHabits(user.id, id),
  ]);

  if (!goal) {
    notFound();
  }

  const daysLeft = goal.deadline
    ? getDaysUntil(goal.deadline)
    : null;

  return (
    <div>
      <Header
        title={goal.title}
        description="Goal details and habits"
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Goal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={getCategoryColor(goal.category)}
              variant="outline"
            >
              {capitalize(goal.category)}
            </Badge>

            <Badge
              variant="outline"
              className="gap-1 capitalize"
            >
              <Flag className="w-3 h-3" />
              {goal.priority}
            </Badge>

            <Badge
              variant="secondary"
              className="capitalize"
            >
              {goal.status}
            </Badge>
          </div>

          <div className="flex gap-2 shrink-0">
            <GenerateHabitsButton goal={goal} />

            <Link href={`/goals/${goal.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Progress
              </p>

              <p className="text-2xl font-bold mb-2">
                {goal.progress}%
              </p>

              <Progress
                value={goal.progress}
                className="h-1.5"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Deadline
              </p>

              <p className="text-lg font-semibold">
                {goal.deadline
                  ? formatDate(goal.deadline)
                  : "No deadline"}
              </p>

              {daysLeft !== null && (
                <p
                  className={`text-sm ${
                    daysLeft < 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {daysLeft < 0
                    ? `${Math.abs(daysLeft)} days overdue`
                    : `${daysLeft} days left`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Active Habits
              </p>

              <p className="text-2xl font-bold">
                {habits.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {goal.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Description
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Habits */}
        <div>
          <h3 className="font-semibold mb-3">
            Habits for this Goal
          </h3>

          <HabitList habits={habits} />
        </div>
      </div>
    </div>
  );
}