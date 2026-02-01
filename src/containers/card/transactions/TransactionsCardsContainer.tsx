import TransactionCard from '@/components/card/transactions/TransactionCard';
import TableSkeleton from '@/components/table/TableSkeleton';
import EmptyTransactionTable from '@/components/card/transactions/EmptyTransactionTable';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import type { Transaction } from '@/types/transaction.type';

const TransactionCardsContainers = () => {
  const { isLoading, data: transactionsData } = useGetAllTransactions();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isLoading) return <TableSkeleton />;
  if (transactionsData.length === 0) return <EmptyTransactionTable />;

  return (
    <section>
      <div className="flex flex-col gap-2">
        {transactionsData.map((t: Transaction) => {
          return (
            <TransactionCard
              key={t.id}
              id={t.id}
              name={t.item.name}
              quantity={t.quantity}
              action={t.action}
              date={t.createdAt}
              openEditModal={toEditTransaction}
              openDeleteModal={toDeleteTransaction}
            />
          );
        })}
      </div>
    </section>
  );
};

export default TransactionCardsContainers;
