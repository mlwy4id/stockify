'use client';
import { useState } from 'react';
import { LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import DashboardStockChart from '../components/DashboardStockChart';
import { useGetDashboardStockChart } from '../hooks/dashboard.query';

const DashboardStockChartContainer = () => {
  const [range, setRange] = useState('');
  const { isLoading, data } = useGetDashboardStockChart(range);

  return (
    <Card>
      <CardHeader className="font-semibold flex flex-row items-center gap-2 border-b">
        <LineChart size={20} className="text-primary" />
        <h1>Stock Level Over Time</h1>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <DashboardStockChart
            points={data?.points ?? []}
            range={range}
            onRangeChange={setRange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStockChartContainer;
