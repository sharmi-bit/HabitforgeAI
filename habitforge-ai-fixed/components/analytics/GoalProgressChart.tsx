"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal } from "@/types";
import { truncate } from "@/lib/utils/format";

export function GoalProgressChart({ goals }: { goals: Goal[] }) {
  if (goals.length === 0) return null;

  const data = goals.map((g, i) => ({
    name: truncate(g.title, 20),
    progress: g.progress,
    fill: ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 5],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Goal Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map(item => (
            <div key={item.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="truncate">{item.name}</span>
                <span className="font-medium shrink-0 ml-2">{item.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.progress}%`, background: item.fill }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
