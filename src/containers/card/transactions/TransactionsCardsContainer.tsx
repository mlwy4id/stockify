import TransactionCard from '@/components/card/transactions/TransactionCard';
import { useGetAllTransactions } from '@/hooks/queries/transactions.query';
import { useTransactionPathNavigation } from '@/hooks/transactions/useTransactionPathNavigation';
import type { Transaction } from '@/types/transaction.type';
import SearchNotFound from '@/components/filters/SearchNotFound';
import { useLocation } from 'react-router-dom';
import EmptyTransactionCard from '@/components/card/transactions/EmptyTransactionCard';
import TransactionsCardsSkeleton from '@/components/skeleton/TransactionsCardsSkeleton';
import { useActionFilterQuery } from '@/hooks/transactions/useActionFilterQueryNavigation';

type Props = {
  searchValue: string;
};

const TransactionCardsContainers = ({ searchValue }: Props) => {
  const { action: actionValue, date } = useActionFilterQuery();

  const location = useLocation();
  const { isLoading, data: transactionsData } = useGetAllTransactions(actionValue, date);
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

  if (isLoading) return <TransactionsCardsSkeleton />;

  if (transactionsData.length === 0 && location.search === '') return <EmptyTransactionCard />;
  if (transactionsData.length === 0) return <SearchNotFound message="No transactions found" />;

  const filteredTransactions = transactionsData.filter((t: Transaction) =>
    t.item.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  if (filteredTransactions.length === 0) return <SearchNotFound message="No transactions found" />;

  return (
    <section>
      <div className="flex flex-col gap-2">
        {filteredTransactions.map((t: Transaction) => {
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
