import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { TodayHabits } from "@/components/dashboard/TodayHabits";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { ActiveGoals } from "@/components/dashboard/ActiveGoals";
import { getFullUserContext } from "@/lib/supabase/queries/profile";
import { getOverallStats } from "@/lib/supabase/queries/analytics";
import { getTodayHabits } from "@/lib/supabase/queries/habits";
import { getActiveGoals } from "@/lib/supabase/queries/goals";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ profile, streak }, stats, todayHabits, activeGoals] = await Promise.all([
    getFullUserContext(user.id),
    getOverallStats(user.id),
    getTodayHabits(user.id),
    getActiveGoals(user.id),
  ]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      <Header title="Dashboard" description="Track your habits and goals" />
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <WelcomeCard
          name={profile?.full_name ?? user.email ?? "there"}
          greeting={greeting()}
          completionRate={stats.completionRate}
        />

        <StatsOverview
          completionRate={stats.completionRate}
          activeGoals={stats.activeGoals}
          totalHabits={stats.totalHabits}
          currentStreak={stats.currentStreak}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <TodayHabits habits={todayHabits} />
          </div>
          <div className="space-y-4">
            <StreakCard
              currentStreak={streak?.current_streak ?? 0}
              longestStreak={streak?.longest_streak ?? 0}
              lastActiveDate={streak?.last_active_date ?? null}
            />
            <ActiveGoals goals={activeGoals.slice(0, 3)} />
          </div>
        </div>
      </div>
    </div>
  );
}
