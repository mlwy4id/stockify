import type { Transaction, UpdateTransaction } from '@stockify/schema';
import { useUpdateTransaction } from '../queries/transactions.query';

export const useConfirmUpdateTransaction = (transaction: Transaction) => {
  const { isPending, mutate } = useUpdateTransaction();

  const confirmUpdate = (updatedTransaction: UpdateTransaction) => {
    mutate({ id: transaction.id, transaction: updatedTransaction });
  };

  return { isPending, confirmUpdate };
};
