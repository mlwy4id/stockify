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
import { invalidateTransactionsQuery } from './helper/invalidateTransactionsQuery';

export const useGetAllTransactions = (action: string, date: string) => {
  return useQuery({
    queryKey: ['Transactions', { action, date }],
    queryFn: () => getAllTransactions(action, date),
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
      invalidateTransactionsQuery(queryClient);
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
      invalidateTransactionsQuery(queryClient);
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
      invalidateTransactionsQuery(queryClient);
    },
    onSettled: () => {
      toTransaction();
    },
  });
};
