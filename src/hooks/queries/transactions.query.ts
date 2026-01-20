import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from '@/lib/api/transactions.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionPathNavigation } from '../transactions/useTransactionPathNavigation';
import type { UpdateTransactionRequest } from 'src/types/transaction.type';

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
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['Transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['Items'] }),
        queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Recent Activity'] }),
      ]);
    },
    onSettled: () => {
      toTransaction();
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation<unknown, Error, UpdateTransactionRequest>({
    mutationFn: updateTransaction,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['Transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['Items'] }),
        queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Recent Activity'] }),
      ]);
    },
    onSettled: () => {
      toTransaction();
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['Transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['Items'] }),
        queryClient.invalidateQueries({ queryKey: ['Dashboard', 'Recent Activity'] }),
      ]);
    },
    onSettled: () => {
      toTransaction();
    },
  });
};
