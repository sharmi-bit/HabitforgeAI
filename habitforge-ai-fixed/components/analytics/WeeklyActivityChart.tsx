"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyActivityChartProps {
  data: { day: string; completed: number; total: number }[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const chartData = DAYS.map(day => {
    const found = data.find(d => d.day === day);
    return { day, completed: found?.completed ?? 0, total: found?.total ?? 0 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} name="Completed">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.completed > 0 ? "#7c3aed" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
