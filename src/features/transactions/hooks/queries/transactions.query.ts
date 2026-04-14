import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from '@/shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionPathNavigation } from '../useTransactionPathNavigation';
import type { UpdateTransactionRequest } from '@/shared/types';
import { invalidateTransactionsQuery } from './invalidateTransactionsQuery';
import { useToastStore } from '@/store/toast';

export const useGetAllTransactions = (action: string, date: string, page: number) => {
  return useQuery({
    queryKey: ['Transactions', { action, date, page }],
    queryFn: () => getAllTransactions(action, date, page),
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
  const { addToast } = useToastStore();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      invalidateTransactionsQuery(queryClient);
      addToast('Transaction created successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to create transaction', 'error');
    },
    onSettled: () => {
      toTransaction();
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation<unknown, Error, UpdateTransactionRequest>({
    mutationFn: updateTransaction,
    onSuccess: () => {
      invalidateTransactionsQuery(queryClient);
      addToast('Transaction updated successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to update transaction', 'error');
    },
    onSettled: () => {
      toTransaction();
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { toTransaction } = useTransactionPathNavigation();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      invalidateTransactionsQuery(queryClient);
      addToast('Transaction deleted successfully', 'success');
    },
    onError: (error: Error) => {
      addToast(error.message || 'Failed to delete transaction', 'error');
    },
    onSettled: () => {
      toTransaction();
    },
  });
};
