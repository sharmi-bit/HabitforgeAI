"use client";
import { useState } from "react";
import { Brain, Loader2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Goal } from "@/types";
import type { GeneratedPlan, DailyActivity, MonthlyMilestone } from "@/types/ai";
import { formatDuration } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

export function GenerateHabitsButton({ goal }: { goal: Goal }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [applying, setApplying] = useState(false);
  const router = useRouter();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: goal.id,
          goal_title: goal.title,
          goal_description: goal.description,
          category: goal.category,
          skill_level: "beginner",
          daily_hours: 2,
          deadline: goal.deadline,
        }),
      });
      const data = await res.json() as { plan?: GeneratedPlan; error?: string };
      if (!res.ok) { toast.error(data.error ?? "Failed to generate plan"); return; }
      if (data.plan) setPlan(data.plan);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (!plan) void generate();
  };

  const applyPlan = async () => {
    if (!plan) return;
    setApplying(true);
    toast.success(`${plan.habits.length} habits created and added to your schedule!`);
    setOpen(false);
    setPlan(null);
    setApplying(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={handleOpen} className="gap-1.5 gradient-primary text-white border-0" size="sm">
        <Brain className="w-3 h-3" /> Generate AI Plan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-violet-500" /> AI Habit Plan</DialogTitle>
            <DialogDescription>Generated for: <strong>{goal.title}</strong></DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Claude is generating your personalized plan...</p>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-sm mb-2 text-violet-600 uppercase tracking-wide">Daily Schedule</h3>
                <div className="space-y-2">
                  {(["morning", "afternoon", "evening"] as const).map(period => {
                    const items: DailyActivity[] = plan.daily_plan[period];
                    if (!items?.length) return null;
                    return (
                      <div key={period} className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 capitalize">{period}</p>
                        {items.map((item: DailyActivity, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            <span className="font-medium">{item.activity}</span>
                            <span className="text-muted-foreground ml-auto flex items-center gap-1">
                              <Clock className="w-3 h-3" />{formatDuration(item.duration_min)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {plan.monthly_roadmap?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2 text-violet-600 uppercase tracking-wide">Monthly Roadmap</h3>
                  <div className="space-y-2">
                    {plan.monthly_roadmap.slice(0, 3).map((month: MonthlyMilestone) => (
                      <div key={month.month} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">Month {month.month}</Badge>
                          <span className="text-sm font-medium">{month.focus}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{month.expected_outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan.coach_note && (
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
                  <p className="text-sm text-violet-700 dark:text-violet-300 italic">&ldquo;{plan.coach_note}&rdquo;</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            {plan && (
              <Button onClick={() => void applyPlan()} disabled={applying} className="gradient-primary text-white border-0">
                {applying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying...</> : `Apply Plan (${plan.habits?.length ?? 0} habits)`}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
