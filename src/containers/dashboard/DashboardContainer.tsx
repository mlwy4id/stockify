import { useGetStocksSummary } from '@/hooks/queries/dashboard.query';
import StocksSummaryCard from '../card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';
import LowStockItemCard from '../card/LowStockItemCard';
import RecentActivityCard from '../card/RecentActivityCard';

const DashboardContainer = () => {
  const { isLoading, data: stocksSummary } = useGetStocksSummary();

  if (isLoading) return <Spinner />;

  const { itemSummary, lowStockItem, recentTransactions } = stocksSummary;
  const { itemIn, itemOut, itemNet } = itemSummary;

  return (
    <>
      <StocksSummaryCard itemIn={itemIn} itemOut={itemOut} itemNet={itemNet} />
      <LowStockItemCard lowStockItems={lowStockItem} />
      <RecentActivityCard recentTransactions={recentTransactions} />
    </>
  );
};

export default DashboardContainer;
