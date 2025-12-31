import type { Item } from '@/types/inventory';
import api from '../axios/axios';

export const getAllItems = async () => {
  const res = await api.get('/inventory');
  return res.data.data;
};

export const createItem = async (item: Item) => {
  const res = await api.post('/inventory', item);
  return res.data;
};
