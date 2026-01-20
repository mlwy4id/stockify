import { useGetItemSummary, useGetRecentActivity, useGetLowStockItem } from '@/hooks/queries/dashboard.query';
import StocksSummaryCard from '../card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';
import LowStockItemCardContainer from '../card/LowStockItemCardContainer';
import RecentActivityCard from '../card/RecentActivityCard';

const DashboardContainer = () => {
  const {data: lowStockItem} = useGetLowStockItem();
  const {data: recentTransactions} = useGetRecentActivity();
  const { isLoading, data: itemSummary } = useGetItemSummary();
  
  if (isLoading) return <Spinner />;

  const { itemRestock, itemSold } = itemSummary;

  return (
    <>
      <StocksSummaryCard itemRestock={itemRestock} itemSold={itemSold} />
      <LowStockItemCardContainer lowStockItems={lowStockItem} />
      <RecentActivityCard recentTransactions={recentTransactions} />
    </>
  );
};

export default DashboardContainer;
