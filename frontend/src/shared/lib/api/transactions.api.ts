import type { CreateTransaction, UpdateTransactionRequest } from '@/shared/types/transaction.type';
import api from '../axios/axios';

export const getAllTransactions = async (actionValue: string, date: string, page: number, tz: string) => {
  const action = actionValue === 'All' ? undefined : actionValue;

  const res = await api.get('transactions', { params: { action, date, page, tz } });
  return res.data;
};

export const getTransaction = async (id?: string) => {
  const res = await api.get(`transactions/${id}`);
  return res.data.data ?? null;
};

export const createTransaction = async (transaction: CreateTransaction) => {
  const res = await api.post('transactions', transaction);
  return res.data.data ?? null;
};

export const updateTransaction = async ({ id, transaction }: UpdateTransactionRequest) => {
  const res = await api.patch(`transactions/${id}`, transaction);
  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res = await api.delete(`transactions/${id}`);
  return res.data;
};
