import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { getCompletionTrend, getOverallStats } from "@/lib/supabase/queries/analytics";
import { CompletionTrendChart } from "@/components/analytics/CompletionTrendChart";
import { StatsOverview } from "@/components/dashboard/StatsOverview";

export default async function AnalyticsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [trend, stats] = await Promise.all([
    getCompletionTrend(user.id, 30),
    getOverallStats(user.id),
  ]);

  return (
    <div>
      <Header title="Analytics" description="Track your habit performance over time" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <StatsOverview
          completionRate={stats.completionRate}
          activeGoals={stats.activeGoals}
          totalHabits={stats.totalHabits}
          currentStreak={stats.currentStreak}
        />
        <CompletionTrendChart data={trend} />
      </div>
    </div>
  );
}
