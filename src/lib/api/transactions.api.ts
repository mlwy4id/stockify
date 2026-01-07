import type { CreateTransaction } from '@stockify/schema';
import axios from 'axios';

export const getAllTransactions = async () => {
    const res = await axios.get('/transactions');
    return res.data.data;
}

export const createTransaction = async (transaction: CreateTransaction) => {
  const res = await axios.post('/transactions', transaction);
  return res.data.data
};
