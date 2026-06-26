import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { HabitList } from "@/components/habits/HabitList";
import { getHabits } from "@/lib/supabase/queries/habits";

export default async function HabitsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const habits = await getHabits(user.id);

  return (
    <div>
      <Header title="Habits" description="All your active habits" />
      <div className="p-6 max-w-4xl mx-auto">
        <HabitList habits={habits} />
      </div>
    </div>
  );
}
