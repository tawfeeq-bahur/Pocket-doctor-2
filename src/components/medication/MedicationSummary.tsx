
"use client";

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { CheckCircle, XCircle, Bell, Pill, CalendarDays } from 'lucide-react';
import type { Medication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { differenceInDays } from 'date-fns';

type MedicationSummaryProps = {
  medications: Medication[];
};

export function MedicationSummary({ medications }: MedicationSummaryProps) {
  const { overallSummary, medicationDetails, durationData } = useMemo(() => {
    let taken = 0;
    let skipped = 0;
    let pending = 0;
    
    const details = medications.map(med => {
      let medTaken = 0;
      let medSkipped = 0;
      let medPending = 0;
      med.doses.forEach(dose => {
        if (dose.status === 'taken') medTaken++;
        else if (dose.status === 'skipped') medSkipped++;
        else medPending++;
      });
      taken += medTaken;
      skipped += medSkipped;
      pending += medPending;
      const totalDoses = medTaken + medSkipped + medPending;
      const adherence = totalDoses > 0 ? (medTaken / totalDoses) * 100 : 0;
      return {
        id: med.id,
        name: med.name,
        adherence: Math.round(adherence),
      };
    });

    const duration = medications.map(med => ({
        name: med.name,
        days: differenceInDays(new Date(), new Date(med.startDate)) + 1
    }));

    const total = taken + skipped + pending;
    return { 
      overallSummary: { taken, skipped, pending, total },
      medicationDetails: details,
      durationData: duration,
    };
  }, [medications]);

  const chartData = [
    { name: 'Taken', value: overallSummary.taken, fill: 'hsl(142.1 76.2% 36.3%)' }, // green-600
    { name: 'Skipped', value: overallSummary.skipped, fill: 'hsl(var(--destructive))' },
    { name: 'Pending', value: overallSummary.pending, fill: 'hsl(210 30% 60%)' }, // accent
  ].filter(d => d.value > 0);

  const chartConfig = {
    taken: { label: "Taken", color: "hsl(142.1 76.2% 36.3%)" },
    skipped: { label: "Skipped", color: "hsl(var(--destructive))" },
    pending: { label: "Pending", color: "hsl(210 30% 60%)" },
    days: { label: "Days Taken", color: "hsl(var(--primary))" },
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Taken</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallSummary.taken}</div>
          <p className="text-xs text-muted-foreground">
            out of {overallSummary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Skipped</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallSummary.skipped}</div>
           <p className="text-xs text-muted-foreground">
            out of {overallSummary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Pending</CardTitle>
          <Bell className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallSummary.pending}</div>
           <p className="text-xs text-muted-foreground">
            out of {overallSummary.total} total doses
          </p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Adherence Overview</CardTitle>
          <CardDescription>Today's dose status for all medications.</CardDescription>
        </CardHeader>
        <CardContent className="h-[160px] pb-4">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
               {overallSummary.total > 0 ? (
                <PieChart>
                  <RechartsTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                   <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    wrapperStyle={{fontSize: '0.8rem'}}
                  />
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

      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Per-Medication Adherence</CardTitle>
          <CardDescription>Adherence percentage for each medication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicationDetails.length > 0 ? (
            medicationDetails.map(med => (
              <div key={med.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">{med.adherence}%</span>
                </div>
                <Progress value={med.adherence} className="h-2" />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-6">
              <Pill className="w-8 h-8 mb-2" />
              <p className="text-xs">No medications to track.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
            <CardTitle>Medication Duration</CardTitle>
            <CardDescription>How long you've been taking each medication.</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] pr-0">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    {durationData.length > 0 ? (
                        <BarChart data={durationData} layout="vertical" margin={{ left: 10, right: 30 }}>
                             <XAxis type="number" dataKey="days" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={80}
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tick={{ dx: -10 }}
                             />
                            <RechartsTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="days" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <CalendarDays className="w-8 h-8 mb-2" />
                            <p className="text-xs">No duration data available.</p>
                        </div>
                    )}
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
