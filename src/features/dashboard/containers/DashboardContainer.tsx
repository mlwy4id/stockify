import {
  useGetItemSummary,
  useGetRecentActivity,
  useGetLowStockItem,
} from '../hooks/dashboard.query';
import DashboardSkeleton from '../components/DashboardSkeleton';
import StocksSummaryCard from './StocksSummaryCard';
import LowStockItemCardContainer from './LowStockItemCardContainer';
import RecentActivityCard from './RecentActivityCard';

const DashboardContainer = () => {
  const { isLoading: lowStockItemLoading, data: lowStockItem } = useGetLowStockItem();
  const { isLoading: recentTransactionsLoading, data: recentTransactions } = useGetRecentActivity();
  const { isLoading: itemSummaryLoading, data: itemSummary } = useGetItemSummary();

  if (lowStockItemLoading || recentTransactionsLoading || itemSummaryLoading)
    return <DashboardSkeleton />;

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
