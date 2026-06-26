"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, LayoutDashboard, Target, ListChecks, BarChart3, User, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  // AI Coach removed from sidebar as requested
];

const bottomItems = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-60 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base">HabitForge AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === href ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => void handleSignOut()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
