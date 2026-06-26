"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DailyCompletionData } from "@/lib/supabase/queries/analytics";
import { formatDateShort } from "@/lib/utils/dates";

interface CompletionTrendChartProps {
  data: DailyCompletionData[];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const chartData = data.map(d => ({
    date: formatDateShort(d.date),
    rate: d.rate,
    completed: d.completed,
    total: d.total,
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Habit Completion Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            No data yet. Start logging habits to see your trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="rate">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Habit Performance (30 Days)</CardTitle>
          <TabsList>
            <TabsTrigger value="rate">Completion %</TabsTrigger>
            <TabsTrigger value="count">Count</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="rate">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} className="fill-muted-foreground" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Completion Rate"]} />
                <Line type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="count">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip />
                <Bar dataKey="completed" fill="#7c3aed" radius={[3, 3, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="#e5e7eb" radius={[3, 3, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
