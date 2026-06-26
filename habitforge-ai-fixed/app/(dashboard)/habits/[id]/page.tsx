import { createServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Target } from "lucide-react";
import { formatDuration } from "@/lib/utils/format";

export default async function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: habit } = await supabase
    .from("habits")
    .select("*, goals(title)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!habit) notFound();

  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", id)
    .order("log_date", { ascending: false })
    .limit(30);

  const completed = (logs ?? []).filter(l => l.status === "completed").length;
  const total = (logs ?? []).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <Header title={habit.title} description="Habit details and history" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Duration</p>
              <p className="text-xl font-bold">{formatDuration(habit.duration_min)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Frequency</p>
              <p className="text-xl font-bold capitalize">{habit.frequency}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">30-day Rate</p>
              <p className="text-xl font-bold">{rate}%</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize">{habit.time_of_day}</Badge>
              <Badge variant="outline" className="capitalize">{habit.frequency}</Badge>
              {habit.goals && (
                <Badge variant="secondary" className="gap-1">
                  <Target className="w-3 h-3" />{(habit.goals as { title: string }).title}
                </Badge>
              )}
            </div>
            {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent History</CardTitle></CardHeader>
          <CardContent>
            {(logs ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No logs yet. Start completing this habit!</p>
            ) : (
              <div className="space-y-2">
                {(logs ?? []).slice(0, 14).map(log => (
                  <div key={log.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <span className="text-muted-foreground">{log.log_date}</span>
                    <Badge variant={log.status === "completed" ? "default" : "secondary"} className="capitalize text-xs">
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}