import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
        <MailCheck className="w-7 h-7 text-violet-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Check your email</h1>
      <p className="text-muted-foreground text-sm mb-6">
        We sent a verification link to your email address.<br />
        Click the link to activate your account.
      </p>
      <Link href="/login">
        <Button className="w-full">Back to Sign In</Button>
      </Link>
    </div>
  );
}
