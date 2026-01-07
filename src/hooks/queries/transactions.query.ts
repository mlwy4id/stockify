import { createTransaction, getAllTransactions } from '@/lib/api/transactions.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionPathNavigation } from '../useTransactionPathNavigation';

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toTransaction();
    },
  });
};
