"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Separator } from "@/components/ui/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      occupation: profile?.occupation ?? "",
      skill_level: profile?.skill_level ?? "beginner",
      daily_time_hours: profile?.daily_time_hours ?? 2,
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", profile!.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  return (
    <Card>
      <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" placeholder="e.g. Software Engineer, Student..." {...register("occupation")} />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Skill Level</Label>
              <Select defaultValue={watch("skill_level")} onValueChange={v => setValue("skill_level", v as ProfileInput["skill_level"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="daily_time_hours">Daily Time (hours)</Label>
              <Input id="daily_time_hours" type="number" step="0.5" min="0.5" max="16"
                {...register("daily_time_hours", { valueAsNumber: true })} />
              {errors.daily_time_hours && <p className="text-xs text-destructive">{errors.daily_time_hours.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
