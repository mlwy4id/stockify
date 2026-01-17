import { useGetStocksSummary } from '@/hooks/queries/dashboard.query';
import StocksSummaryCard from '../card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';
import LowStockItemCardContainer from '../card/LowStockItemCardContainer';
import RecentActivityCard from '../card/RecentActivityCard';

const DashboardContainer = () => {
  const { isLoading, data: stocksSummary } = useGetStocksSummary();

  if (isLoading) return <Spinner />;

  const { itemSummary, lowStockItem, recentTransactions } = stocksSummary;
  const { itemRestock, itemSold, itemNet } = itemSummary;

  return (
    <>
      <StocksSummaryCard itemRestock={itemRestock} itemSold={itemSold} itemNet={itemNet} />
      <LowStockItemCardContainer lowStockItems={lowStockItem} />
      <RecentActivityCard recentTransactions={recentTransactions} />
    </>
  );
};

export default DashboardContainer;
