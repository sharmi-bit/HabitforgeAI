import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export default async function NotificationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const items = notifications ?? [];
  const unread = items.filter(n => !n.is_read).length;

  return (
    <div>
      <Header title="Notifications" description={`${unread} unread`} />
      <div className="p-6 max-w-3xl mx-auto">
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="Notifications about your goals, habits, and achievements will appear here." />
        ) : (
          <div className="space-y-2">
            {items.map(n => (
              <Card key={n.id} className={cn(!n.is_read && "border-primary/30 bg-primary/5")}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", n.is_read ? "bg-muted" : "bg-primary")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{formatRelative(n.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <Badge variant="outline" className="text-xs mt-2 capitalize">{n.type.replace(/_/g, " ")}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
