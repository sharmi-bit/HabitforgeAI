import { format, formatDistance, isToday, isYesterday, parseISO } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function getDaysUntil(deadline: string): number {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getTodayDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: format(start, "yyyy-MM-dd"), end: format(end, "yyyy-MM-dd") };
}
