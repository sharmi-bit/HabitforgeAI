import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  name: string;
  greeting: string;
  completionRate: number;
  plan?: string; // kept for API compatibility, ignored
}

export function WelcomeCard({ name, greeting, completionRate }: WelcomeCardProps) {
  const firstName = name.split(" ")[0];
  return (
    <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute bottom-4 right-24 w-16 h-16 rounded-full bg-white/20" />
      </div>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">{greeting} 👋</p>
          <h2 className="text-2xl font-bold mb-2">{firstName}!</h2>
          <p className="text-white/80 text-sm">
            {completionRate > 0
              ? `You're at ${completionRate}% completion today. Keep it up!`
              : "Start logging your habits to track your progress."}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/20 text-white rounded-full px-3 py-1.5 text-xs shrink-0">
          <Sparkles className="w-3 h-3" /> All Access
        </div>
      </div>
    </div>
  );
}
