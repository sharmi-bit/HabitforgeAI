"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { z } from "zod";

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    setLoading(false);
    if (error) { toast.error(error.message); }
    else {
      toast.success("Password updated! Please sign in.");
      router.push("/login");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-muted-foreground mt-1 text-sm">Choose a strong password for your account.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" placeholder="8+ characters" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Password"}
        </Button>
      </form>
    </>
  );
}
