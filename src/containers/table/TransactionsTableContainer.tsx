import EmptyTransactionTable from '@/components/table/transaction/EmptyTransactionTable';
import TableSkeleton from '@/components/table/TableSkeleton';
import TransactionsTable from '@/components/table/transaction/TransactionsTable';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';

const TransactionsTableContainer = () => {
  const { isLoading, data: transactionsData } = useGetAllTransactions();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isLoading) return <TableSkeleton />;
  if (transactionsData.length === 0) return <EmptyTransactionTable />;

  return (
    <TransactionsTable
      transactions={transactionsData}
      openEditModal={toEditTransaction}
      openDeleteModal={toDeleteTransaction}
    />
  );
};

export default TransactionsTableContainer;
