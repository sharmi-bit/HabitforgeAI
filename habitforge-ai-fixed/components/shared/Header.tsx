"use client";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Link href="/notifications">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
