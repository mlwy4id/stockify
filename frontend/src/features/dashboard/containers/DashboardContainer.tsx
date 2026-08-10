'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import ProductVolumeChart from '@/features/products/detail/components/ProductVolumeChart';
import ProductRatioChart from '@/features/products/detail/components/ProductRatioChart';
import {
  useGetDashboardStockMovementSummary,
  useGetDashboardLowStockProducts,
  useGetDashboardTopMovers,
} from '../hooks/dashboard.query';
import DashboardSkeleton from '../components/DashboardSkeleton';
import StocksSummaryCard from './StocksSummaryCard';
import DashboardStockChartContainer from './DashboardStockChartContainer';
import LowStockItemCardContainer from './LowStockItemCardContainer';
import TopMoversCard from './TopMoversCard';

const DashboardContainer = () => {
  const { isLoading: summaryLoading, data: summary } = useGetDashboardStockMovementSummary();
  const { isLoading: lowStockLoading, data: lowStockProducts } = useGetDashboardLowStockProducts();
  const { isLoading: topMoversLoading, data: topMovers } = useGetDashboardTopMovers(5, '1d');
  const [volumeRange, setVolumeRange] = useState('');
  const [ratioRange, setRatioRange] = useState('');

  if (summaryLoading || lowStockLoading || topMoversLoading) return <DashboardSkeleton />;

  return (
    <>
      <StocksSummaryCard
        totalIn={summary?.totalIn ?? 0}
        totalOut={summary?.totalOut ?? 0}
        inChangePercentage={summary?.inChangePercentage ?? 0}
        outChangePercentage={summary?.outChangePercentage ?? 0}
        totalActiveProduct={summary?.totalActiveProduct ?? 0}
        totalQuantity={summary?.totalQuantity ?? 0}
      />
      <DashboardStockChartContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="font-semibold border-b">
            <h1>Volume by Range</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <ProductVolumeChart
              volume={summary?.volume ?? []}
              range={volumeRange}
              onRangeChange={setVolumeRange}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="font-semibold border-b">
            <h1>Sold vs Broken by Range</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ProductRatioChart
              ratio={summary?.ratio ?? []}
              range={ratioRange}
              onRangeChange={setRatioRange}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LowStockItemCardContainer lowStockItems={lowStockProducts ?? []} />
        <TopMoversCard topMovers={topMovers ?? []} />
      </div>
    </>
  );
};

export default DashboardContainer;
