import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Target } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/goals/GoalCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getGoals } from "@/lib/supabase/queries/goals";

export default async function GoalsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const goals = await getGoals(user.id);
  const active = goals.filter(g => g.status === "active");
  const archived = goals.filter(g => g.status !== "active");

  return (
    <div>
      <Header title="Goals" description="Manage your goals and track progress" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">{active.length} active</h2>
          </div>
          <Link href="/goals/new">
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Goal</Button>
          </Link>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Create your first goal and let AI generate a personalized habit plan for you."
            action={{ label: "Create First Goal", href: "/goals/new" }}
          />
        ) : (
          <div className="space-y-6">
            {active.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Active</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {active.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </div>
              </section>
            )}
            {archived.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Archived / Completed</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {archived.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
