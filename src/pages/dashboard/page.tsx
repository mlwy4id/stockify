import { useGetStocksSummary } from '@/hooks/queries/dashboard.query';
import PageLayout from '../layout/PageLayout';
import StocksSummaryCard from '@/containers/card/StocksSummaryCard';
import { Spinner } from '@/components/ui/spinner';

const DashboardPage = () => {
  const { isFetching, data: stocksSummary } = useGetStocksSummary();

  if (isFetching) return <Spinner />;

  const { itemSummary, lowStockItem, recentTransactions } = stocksSummary;
  const { itemIn, itemOut, itemNet } = itemSummary;

  return (
    <PageLayout title="Dashboard">
      <StocksSummaryCard itemIn={itemIn} itemOut={itemOut} itemNet={itemNet} />
    </PageLayout>
  );
};

export default DashboardPage;
