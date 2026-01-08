import TransactionsTable from '@/components/table/TransactionsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetTransactions } from '@/hooks/queries/transactions.query';

const TransactionsTableContainer = () => {
  const { isFetching, data: transactionsData } = useGetTransactions();

  if (isFetching) return <Spinner />;

  return <TransactionsTable transactions={transactionsData} />;
};

export default TransactionsTableContainer;
