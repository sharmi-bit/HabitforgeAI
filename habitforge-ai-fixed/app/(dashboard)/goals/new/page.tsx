import { Header } from "@/components/shared/Header";
import { GoalForm } from "@/components/goals/GoalForm";

export default function NewGoalPage() {
  return (
    <div>
      <Header title="New Goal" description="Define what you want to achieve" />
      <div className="p-6 max-w-2xl mx-auto">
        <GoalForm />
      </div>
    </div>
  );
}
