import Link from "next/link";
import { ArrowRight, Brain, Target, TrendingUp, Zap, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">HabitForge AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary text-white border-0">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
          ✨ Powered by Claude AI
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-gray-900 via-violet-700 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-violet-300 dark:to-purple-400">
          Turn Goals Into
          <br />Daily Habits
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          HabitForge AI converts your ambitious goals into step-by-step daily habits,
          weekly schedules, and monthly roadmaps — automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="gradient-primary text-white border-0 gap-2 px-8 h-12 text-base">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="gap-2 h-12 text-base">
              View Plans
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">No credit card required · Free plan available</p>
      </section>

      {/* Example Card */}
      <section className="container pb-20">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Goal</p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2"><span className="font-medium">Goal:</span><span>Get placed in 6 months</span></div>
                <div className="flex gap-2"><span className="font-medium">Level:</span><span>Java Beginner</span></div>
                <div className="flex gap-2"><span className="font-medium">Time:</span><span>3 hours daily</span></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-3">AI Output</p>
              <div className="space-y-2 text-sm">
                {[
                  { time: "Morning", task: "45 min Java Core Concepts" },
                  { time: "Afternoon", task: "2 DSA Problems (LeetCode)" },
                  { time: "Evening", task: "30 min Revision + Notes" },
                  { time: "Weekend", task: "Mock Interview Practice" },
                ].map((item) => (
                  <div key={item.time} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
                    <span><span className="font-medium">{item.time}:</span> {item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "AI Habit Generator", desc: "Claude AI creates personalized daily, weekly, and monthly plans based on your goal, skill level, and available time." },
            { icon: TrendingUp, title: "Progress Tracking", desc: "Track completion rates, streaks, and momentum with beautiful analytics charts and insights." },
            { icon: Zap, title: "AI Coach", desc: "Chat with your personal AI coach anytime — get recovery plans, motivation, and schedule adjustments." },
            { icon: Target, title: "Goal Management", desc: "Organize multiple goals with priorities, deadlines, and progress indicators in one clean dashboard." },
            { icon: Star, title: "Streak System", desc: "Build consistency with daily streaks, milestone celebrations, and smart reminders." },
            { icon: CheckCircle, title: "Smart Reminders", desc: "Automated email reminders, weekly reports, and re-engagement nudges keep you on track." },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-900 rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="gradient-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to forge your habits?</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of people achieving their goals with AI-powered habit systems.</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2 h-12 text-base font-semibold">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2025 HabitForge AI · Built with Next.js + Claude AI</p>
      </footer>
    </div>
  );
}
