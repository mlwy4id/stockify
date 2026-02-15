import { useCreateTransaction } from './queries/transactions.query';

export const useConfirmCreateTransaction = () => {
  const { isPending, mutate } = useCreateTransaction();

  const confirmCreate = (transaction: any) => {
    mutate(transaction);
  };

  return { isPending, confirmCreate };
};
