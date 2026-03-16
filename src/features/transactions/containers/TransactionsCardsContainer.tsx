import TransactionCard from '../components/TransactionCard';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';
import type { Transaction } from '@/shared/types';
import { SearchNotFound } from '@/shared/components';
import { useLocation } from 'react-router-dom';
import EmptyTransactionCard from '../components/EmptyTransactionCard';
import { useActionFilterQuery } from '../hooks/useActionFilterQueryNavigation';
import { useGetAllTransactions } from '../hooks/queries/transactions.query';
import TransactionsCardsSkeleton from '../components/TransactionsCardsSkeleton';
import { useEffect } from 'react';

type Props = {
  searchValue: string;
  setTransactionsDataAvailability: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransactionCardsContainers = ({ searchValue, setTransactionsDataAvailability }: Props) => {
  const location = useLocation();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();
  
  const { action: actionValue, date, page } = useActionFilterQuery();
  const { isLoading, data } = useGetAllTransactions(actionValue, date, page);
  
  const transactionsData = data?.data ?? []

  useEffect(() => {
    setTransactionsDataAvailability(transactionsData.length > 0);
  }, [transactionsData]);
  
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
