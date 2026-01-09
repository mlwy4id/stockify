import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from '@/lib/api/transactions.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionPathNavigation } from '../useTransactionPathNavigation';
import type { UpdateTransactionRequest } from '@stockify/schema';

export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: ['Transactions'],
    queryFn: getAllTransactions,
    staleTime: 1000 * 30,
  });
};

export const useGetTransaction = (id?: string) => {
  return useQuery({
    queryKey: ['Transaction', id],
    queryFn: () => getTransaction(id),
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

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation<unknown, Error, UpdateTransactionRequest>({
    mutationFn: updateTransaction,
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['Transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['Items'] }),
      ]);
      toTransaction();
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation({
    mutationFn: deleteTransaction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['Transactions'] });
      toTransaction();
    },
  });
};
