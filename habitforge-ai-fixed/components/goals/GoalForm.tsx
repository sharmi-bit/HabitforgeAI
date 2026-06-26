"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { goalSchema, type GoalInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import type { Goal } from "@/types";

export function GoalForm({ goal }: { goal?: Goal }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal
      ? {
          title: goal.title,
          description: goal.description ?? undefined,
          category: goal.category,
          deadline: goal.deadline ?? undefined,
          priority: goal.priority,
          difficulty: goal.difficulty,
        }
      : { priority: "medium", difficulty: "moderate", category: "other" },
  });

  const onSubmit = async (data: GoalInput) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (goal) {
      const { error } = await supabase
        .from("goals")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", goal.id);
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Goal updated!");
      router.push(`/goals/${goal.id}`);
    } else {
      const { data: newGoal, error } = await supabase
        .from("goals")
        .insert({ ...data, user_id: user.id, progress: 0 })
        .select()
        .single();
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Goal created!");
      router.push(`/goals/${newGoal.id}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Goal Title *</Label>
        <Input id="title" placeholder="e.g. Get placed in 6 months" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your goal in detail..." rows={3} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select defaultValue={watch("category")} onValueChange={v => setValue("category", v as GoalInput["category"])}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {(["placement","fitness","learning","career","health","finance","personal","other"] as const).map(c => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...register("deadline")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select defaultValue={watch("priority")} onValueChange={v => setValue("priority", v as GoalInput["priority"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["low","medium","high","critical"] as const).map(p => (
                <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <Select defaultValue={watch("difficulty")} onValueChange={v => setValue("difficulty", v as GoalInput["difficulty"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["easy","moderate","hard","extreme"] as const).map(d => (
                <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : goal ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
}
