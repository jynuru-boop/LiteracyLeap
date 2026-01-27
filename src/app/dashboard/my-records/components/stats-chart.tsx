'use client';

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

type StatsChartProps = {
  data: {
    name: string;
    accuracy: number;
  }[];
};

const chartConfig = {
  accuracy: {
    label: '정답률',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function StatsChart({ data }: StatsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리별 정답률</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <RechartsBarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent
                formatter={(value) => `${value}%`}
                />}
            />
            <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
