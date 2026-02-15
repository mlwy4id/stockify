import TransactionCard from '../components/TransactionCard';
import { useTransactionPathNavigation } from '../hooks/useTransactionPathNavigation';
import type { Transaction } from '@/shared/types';
import {SearchNotFound} from '@/shared/components';
import { useLocation } from 'react-router-dom';
import EmptyTransactionCard from '../components/EmptyTransactionCard';

type Props = {
  searchValue: string;
  transactionsData: Transaction[];
};

const TransactionCardsContainers = ({ searchValue, transactionsData }: Props) => {
  const location = useLocation();
  const { toEditTransaction, toDeleteTransaction } = useTransactionPathNavigation();

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
