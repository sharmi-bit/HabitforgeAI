import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { ChatWindow } from "@/components/coach/ChatWindow";
import type { CoachMessage } from "@/types";

export default async function AICoachPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: history } = await supabase
    .from("coach_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  return (
    <div className="flex flex-col h-screen">
      <Header title="AI Coach" description="Your personal habit coach — powered by Claude" />
      <div className="flex-1 overflow-hidden">
        <ChatWindow initialMessages={(history ?? []) as CoachMessage[]} />
      </div>
    </div>
  );
}
