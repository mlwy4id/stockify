import type { Transaction } from '@stockify/schema';
import { useDeleteTransaction } from '../queries/transactions.query';

export const useConfirmDeleteTransaction = (transaction: Transaction) => {
  const { isPending, mutate } = useDeleteTransaction();

  const confirmDelete = () => {
    mutate(transaction.id);
  };

  return { isPending, confirmDelete };
};
