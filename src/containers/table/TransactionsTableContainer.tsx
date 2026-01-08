import TransactionsTable from '@/components/table/TransactionsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const TransactionsTableContainer = () => {
  const { isFetching, data: transactionsData } = useGetAllTransactions();
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
