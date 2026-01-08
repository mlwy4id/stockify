import TransactionsTable from '@/components/table/TransactionsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const TransactionsTableContainer = () => {
  const { isFetching, data: transactionsData } = useGetTransactions();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isFetching) return <Spinner />;

  return (
    <TransactionsTable
      transactions={transactionsData}
      openEditModal={toEditTransaction}
      openDeleteModal={toDeleteTransaction}
    />
  );
};

export default TransactionsTableContainer;
