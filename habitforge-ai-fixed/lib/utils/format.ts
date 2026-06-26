export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    placement: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    fitness: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    learning: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    career: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    health: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    finance: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    personal: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };
  return colors[category] ?? colors.other;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "text-gray-500",
    medium: "text-blue-500",
    high: "text-orange-500",
    critical: "text-red-500",
  };
  return colors[priority] ?? "text-gray-500";
}
