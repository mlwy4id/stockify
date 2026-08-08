'use client';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, ArrowLeft, Package, RefreshCcw, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import SummaryCard from '@/shared/components/SummaryCard';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ProductChartContainer from './ProductChartContainer';
import ProductRatioChart from '../components/ProductRatioChart';
import ProductVolumeChart from '../components/ProductVolumeChart';
import { useGetProductDashboard } from '../hooks/queries/product-detail.query';

type Props = {
  id: string;
};

const ProductDetailContainer = ({ id }: Props) => {
  const { isLoading: dashboardLoading, data: dashboard } = useGetProductDashboard(id);
  const [volumeRange, setVolumeRange] = useState('');
  const [ratioRange, setRatioRange] = useState('');

  if (dashboardLoading) return <ProductDetailSkeleton />;

  const currentStock = dashboard?.currentStock ?? 0;
  const stockThreshold = dashboard?.stockThreshold;
  const volume = dashboard?.volume ?? [];
  const ratio = dashboard?.ratio ?? [];
  const depletion = dashboard?.depletion;
  const restockInterval = dashboard?.restockInterval;

  const avgRestockDays = restockInterval?.avgRestockIntervalDays;
  const depletionDate = depletion?.estimatedDate ? new Date(depletion.estimatedDate) : null;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/products"
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={Package}
          cardTitle="Current Stock"
          cardContent={`${currentStock} items`}
          stripColor="bg-primary"
          cardTitleColor="text-primary"
          cardContentColor="text-primary"
        />
        <SummaryCard
          icon={AlertTriangle}
          cardTitle="Stock Threshold"
          cardContent={stockThreshold ? `${stockThreshold} items` : 'Not set'}
          stripColor="bg-warning"
          cardTitleColor="text-warning"
          cardContentColor="text-warning"
        />
        <SummaryCard
          icon={RefreshCcw}
          cardTitle="Avg Restock Interval"
          cardContent={avgRestockDays != null ? `${avgRestockDays} days` : 'No data'}
          stripColor="bg-success"
          cardTitleColor="text-success"
          cardContentColor="text-success"
        />
        <SummaryCard
          icon={TrendingDown}
          cardTitle="Est. Stock Depletion"
          cardContent={depletion?.daysLeft != null ? `${depletion.daysLeft} days` : 'No data'}
          stripColor="bg-danger"
          cardTitleColor="text-danger"
          cardContentColor="text-danger"
        />
      </div>

      <ProductChartContainer id={id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="font-semibold border-b">
            <h2>Volume by Range</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <ProductVolumeChart
              volume={volume}
              range={volumeRange}
              onRangeChange={setVolumeRange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-semibold border-b">
            <h2>Sold vs Broken by Range</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ProductRatioChart
              ratio={ratio}
              range={ratioRange}
              onRangeChange={setRatioRange}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="font-semibold border-b">
          <h2>Restock &amp; Depletion Insights</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Restock Count</p>
            <p className="text-lg font-semibold">{restockInterval?.restockCount ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Restock Interval</p>
            <p className="text-lg font-semibold">
              {avgRestockDays != null ? `${avgRestockDays} days` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Daily Outflow</p>
            <p className="text-lg font-semibold">
              {depletion?.avgDailyOut != null ? depletion.avgDailyOut.toFixed(1) : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimated Depletion Date</p>
            <p className="text-lg font-semibold">
              {depletionDate ? format(depletionDate, 'd MMM yyyy') : '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailContainer;
