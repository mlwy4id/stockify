'use client';
import {
  useGetDashboardSummary,
  useGetDashboardLowStockProducts,
  useGetDashboardTopMovers,
} from '../hooks/dashboard.query';
import DashboardSkeleton from '../components/DashboardSkeleton';
import StocksSummaryCard from './StocksSummaryCard';
import LowStockItemCardContainer from './LowStockItemCardContainer';
import TopMoversCard from './TopMoversCard';

const DashboardContainer = () => {
  const { isLoading: summaryLoading, data: summary } = useGetDashboardSummary('1d');
  const { isLoading: lowStockLoading, data: lowStockProducts } = useGetDashboardLowStockProducts();
  const { isLoading: topMoversLoading, data: topMovers } = useGetDashboardTopMovers(5, '1d');

  if (summaryLoading || lowStockLoading || topMoversLoading) return <DashboardSkeleton />;

  const totalIn = summary?.totalIn ?? 0;
  const totalOut = summary?.totalOut ?? 0;

  return (
    <>
      <StocksSummaryCard totalIn={totalIn} totalOut={totalOut} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LowStockItemCardContainer lowStockItems={lowStockProducts ?? []} />
        <TopMoversCard topMovers={topMovers ?? []} />
      </div>
    </>
  );
};

export default DashboardContainer;
