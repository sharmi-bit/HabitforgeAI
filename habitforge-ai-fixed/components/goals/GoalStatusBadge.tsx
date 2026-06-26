import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { GoalStatus } from "@/types";

const statusStyles: Record<GoalStatus, string> = {
  active: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  completed: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  archived: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
  paused: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
};

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize text-xs", statusStyles[status])}>
      {status}
    </Badge>
  );
}
