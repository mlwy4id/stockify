import { useGetStocksSummary } from '@/hooks/queries/dashboard.query';
import StocksSummaryCard from '../card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';
import LowStockItemCard from '../card/LowStockItemCard';

const DashboardContainer = () => {
  const { isFetching, data: stocksSummary } = useGetStocksSummary();

  if (isFetching) return <Spinner />;

  const { itemSummary, lowStockItem, recentTransactions } = stocksSummary;
  const { itemIn, itemOut, itemNet } = itemSummary;

  return (
    <>
      <StocksSummaryCard itemIn={itemIn} itemOut={itemOut} itemNet={itemNet} />
      <LowStockItemCard lowStockItems={lowStockItem} />
    </>
  );
};

export default DashboardContainer;
