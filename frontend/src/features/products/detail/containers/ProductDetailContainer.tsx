'use client';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertTriangle, ArrowLeft, Package, RefreshCcw, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import SummaryCard from '@/shared/components/SummaryCard';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ProductChartContainer from './ProductChartContainer';
import { useGetProductDashboard } from '../hooks/queries/product-detail.query';

type Props = {
  id: string;
};

const RANGE_LABELS: Record<string, string> = {
  '1w': '1 Week',
  '1m': '1 Month',
  '3m': '3 Months',
  '6m': '6 Months',
  '1y': '1 Year',
  all: 'All Time',
};

const ProductDetailContainer = ({ id }: Props) => {
  const { isLoading: dashboardLoading, data: dashboard } = useGetProductDashboard(id);

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
          cardBgColor="bg-primary-subtle"
          cardTitleColor="text-primary"
          cardContentColor="text-primary"
        />
        <SummaryCard
          icon={AlertTriangle}
          cardTitle="Stock Threshold"
          cardContent={stockThreshold ? `${stockThreshold} items` : 'Not set'}
          cardBgColor="bg-neutral-action/10"
          cardTitleColor="text-neutral-action"
          cardContentColor="text-neutral-action"
        />
        <SummaryCard
          icon={RefreshCcw}
          cardTitle="Avg Restock Interval"
          cardContent={avgRestockDays != null ? `${avgRestockDays} days` : 'No data'}
          cardBgColor="bg-success/10"
          cardTitleColor="text-success"
          cardContentColor="text-success"
        />
        <SummaryCard
          icon={TrendingDown}
          cardTitle="Est. Stock Depletion"
          cardContent={depletion?.daysLeft != null ? `${depletion.daysLeft} days` : 'No data'}
          cardBgColor="bg-danger/10"
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
            {volume.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No data</p>
            ) : (
              volume.map((v) => (
                <div
                  key={v.range}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">
                    {RANGE_LABELS[v.range] ?? v.range}
                  </span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-success">+{v.totalIn} in</span>
                    <span className="text-neutral-action">-{v.totalOut} out</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="font-semibold border-b">
            <h2>Sold vs Broken by Range</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {ratio.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No data</p>
            ) : (
              ratio.map((r) => (
                <div key={r.range} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{RANGE_LABELS[r.range] ?? r.range}</span>
                    <span>
                      {r.soldPercentage}% sold / {r.brokenPercentage}% broken
                    </span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${r.soldPercentage}%` }}
                    />
                    <div
                      className="h-full bg-danger"
                      style={{ width: `${r.brokenPercentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
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
