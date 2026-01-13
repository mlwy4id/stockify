import EmptyTransactionTable from '@/components/table/EmptyTransactionTable';
import TransactionsTable from '@/components/table/TransactionsTable';
import { Spinner } from '@/components/ui/spinner';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/useTransactionPathNavigation';

const TransactionsTableContainer = () => {
  const { isFetching, data: transactionsData } = useGetAllTransactions();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isFetching) return <Spinner />;

  if (transactionsData.length === 0) {
    return <EmptyTransactionTable />;
  } else {
    return (
      <TransactionsTable
        transactions={transactionsData}
        openEditModal={toEditTransaction}
        openDeleteModal={toDeleteTransaction}
      />
    );
  }
};

export default TransactionsTableContainer;
