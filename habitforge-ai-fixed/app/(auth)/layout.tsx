import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <Link href="/" className="font-bold text-2xl tracking-tight">HabitForge AI</Link>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
