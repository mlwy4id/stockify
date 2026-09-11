'use client';
import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, RefreshCcw, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import SummaryCard from '@/shared/components/SummaryCard';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ProductDetailCard from '../components/ProductDetailCard';
import StockMovementHistory from '../components/StockMovementHistory';
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
        Kembali ke Produk
      </Link>

      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <ProductDetailCard
          name={dashboard?.productName ?? 'Produk Tidak Dikenal'}
          imageUrl={dashboard?.imageUrl}
          categoryId={dashboard?.categoryId}
          currentStock={currentStock}
          stockThreshold={stockThreshold}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 w-full">
          <SummaryCard
            icon={RefreshCcw}
            cardTitle="Rata-rata Interval Restok"
            cardContent={avgRestockDays != null ? `${avgRestockDays} hari` : 'Tidak ada data'}
            stripColor="bg-success"
            cardTitleColor="text-success"
            cardContentColor="text-success"
          />
          <SummaryCard
            icon={TrendingDown}
            cardTitle="Perkiraan Kehabisan Stok"
            cardContent={depletion?.daysLeft != null ? `${depletion.daysLeft} hari` : 'Tidak ada data'}
            stripColor="bg-danger"
            cardTitleColor="text-danger"
            cardContentColor="text-danger"
          />
        </div>
      </div>

      <Tabs defaultValue="chart">
        <div className="py-3">
          <TabsList className="flex w-full justify-around">
            <TabsTrigger value="chart" className="w-[50%] cursor-pointer">
              Grafik
            </TabsTrigger>
            <TabsTrigger value="history" className="w-[50%] cursor-pointer">
              Riwayat
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chart" className="flex flex-col gap-4">
          <ProductChartContainer id={id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="font-semibold border-b">
                <h2>Volume per Rentang</h2>
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
                <h2>Terjual vs Rusak per Rentang</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ProductRatioChart ratio={ratio} range={ratioRange} onRangeChange={setRatioRange} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="font-semibold border-b">
              <h2>Analisis Restok &amp; Kehabisan Stok</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Jumlah Restok</p>
                <p className="text-lg font-semibold">{restockInterval?.restockCount ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Interval Restok</p>
                <p className="text-lg font-semibold">
                  {avgRestockDays != null ? `${avgRestockDays} hari` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Keluaran Harian</p>
                <p className="text-lg font-semibold">
                  {depletion?.avgDailyOut != null ? depletion.avgDailyOut.toFixed(1) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Perkiraan Tanggal Kehabisan Stok</p>
                <p className="text-lg font-semibold">
                  {depletionDate ? format(depletionDate, 'd MMM yyyy') : '—'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <StockMovementHistory productId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailContainer;
