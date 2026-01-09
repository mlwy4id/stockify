import type { CreateTransaction, UpdateTransactionRequest } from '@stockify/schema';
import api from '../axios/axios';

export const getAllTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data.data;
};

export const getTransaction = async (id?: string) => {
  const res = await api.get(`transactions/${id}`);
  return res.data.data;
};

export const createTransaction = async (transaction: CreateTransaction) => {
  const res = await api.post('/transactions', transaction);
  return res.data.data;
};

export const updateTransaction = async ({ id, transaction }: UpdateTransactionRequest) => {
  const res = await api.patch(`/transactions/${id}`, transaction);
  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res = await api.delete(`/transaction/${id}`);
  return res.data;
};
