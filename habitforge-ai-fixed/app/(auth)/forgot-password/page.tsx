"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); } else { setSent(true); }
  };

  if (sent) return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📧</span>
      </div>
      <h2 className="text-xl font-bold mb-2">Check your email</h2>
      <p className="text-muted-foreground text-sm mb-6">We sent a password reset link to your email address.</p>
      <Link href="/login"><Button variant="outline" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in</Button></Link>
    </div>
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground mt-1 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send reset link"}
        </Button>
      </form>
      <Link href="/login"><Button variant="ghost" className="w-full mt-3"><ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in</Button></Link>
    </>
  );
}
