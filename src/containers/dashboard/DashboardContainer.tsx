import {
  useGetItemSummary,
  useGetRecentActivity,
  useGetLowStockItem,
} from '@/hooks/queries/dashboard.query';
import StocksSummaryCard from '../card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';
import LowStockItemCardContainer from '../card/LowStockItemCardContainer';
import RecentActivityCard from '../card/RecentActivityCard';

const DashboardContainer = () => {
  const { isLoading: lowStockItemLoading, data: lowStockItem } = useGetLowStockItem();
  const { isLoading: recentTransactionsLoading, data: recentTransactions } = useGetRecentActivity();
  const { isLoading: itemSummaryLoading, data: itemSummary } = useGetItemSummary();

  if (lowStockItemLoading || recentTransactionsLoading || itemSummaryLoading) return <Spinner />;

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
