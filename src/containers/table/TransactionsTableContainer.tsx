import EmptyTransactionTable from '@/components/table/EmptyTransactionTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import TransactionsTable from '@/components/table/TransactionsTable';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';

const TransactionsTableContainer = () => {
  const { isFetching, data: transactionsData } = useGetAllTransactions();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isFetching) return <TableSkeleton />;

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
