import type { CreateTransaction } from '@stockify/schema';
import api from '../axios/axios';

export const getAllTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data.data;
};

export const createTransaction = async (transaction: CreateTransaction) => {
  const res = await api.post('/transactions', transaction);
  return res.data.data;
};
