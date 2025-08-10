"use client";

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, Bell, Pill } from 'lucide-react';
import type { Medication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type MedicationSummaryProps = {
  medications: Medication[];
};

export function MedicationSummary({ medications }: MedicationSummaryProps) {
  const summary = useMemo(() => {
    let taken = 0;
    let skipped = 0;
    let pending = 0;

    medications.forEach(med => {
      med.doses.forEach(dose => {
        if (dose.status === 'taken') taken++;
        else if (dose.status === 'skipped') skipped++;
        else pending++;
      });
    });

    const total = taken + skipped + pending;
    return { taken, skipped, pending, total };
  }, [medications]);

  const chartData = [
    { name: 'Taken', value: summary.taken, fill: 'hsl(var(--chart-2))' },
    { name: 'Skipped', value: summary.skipped, fill: 'hsl(var(--destructive))' },
    { name: 'Pending', value: summary.pending, fill: 'hsl(var(--chart-1))' },
  ].filter(d => d.value > 0);

  const chartConfig = {
    taken: { label: "Taken", color: "hsl(var(--chart-2))" },
    skipped: { label: "Skipped", color: "hsl(var(--destructive))" },
    pending: { label: "Pending", color: "hsl(var(--chart-1))" },
  };


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Taken</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.taken}</div>
          <p className="text-xs text-muted-foreground">
            out of {summary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Skipped</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.skipped}</div>
           <p className="text-xs text-muted-foreground">
            out of {summary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Pending</CardTitle>
          <Bell className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.pending}</div>
           <p className="text-xs text-muted-foreground">
            out of {summary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Adherence Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[120px] pb-4">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
               {summary.total > 0 ? (
                <PieChart>
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
               ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Pill className="w-8 h-8 mb-2" />
                  <p className="text-xs">No dose data available</p>
                </div>
               )}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
