import { createTransaction, getAllTransactions } from '@/lib/api/transactions.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionPathNavigation } from '../useTransactionPathNavigation';

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['Transactions'],
    queryFn: getAllTransactions,
    staleTime: 1000 * 30,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation({
    mutationFn: createTransaction,
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['Transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['Items'] }),
      ]);
      toTransaction();
    },
  });
};
