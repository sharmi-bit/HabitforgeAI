import { createServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { GoalForm } from "@/components/goals/GoalForm";
import { getGoalById } from "@/lib/supabase/queries/goals";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGoalPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const goal = await getGoalById(id, user.id);

  if (!goal) {
    notFound();
  }

  return (
    <div>
      <Header
        title="Edit Goal"
        description={goal.title}
      />

      <div className="p-6 max-w-2xl mx-auto">
        <GoalForm goal={goal} />
      </div>
    </div>
  );
}