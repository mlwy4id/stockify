import type { CreateItem, UpdateItemRequest } from '@/types/inventory';
import api from '../axios/axios';

export const getAllItems = async () => {
  const res = await api.get('/inventory');
  return res.data.data;
};

export const getItem = async (id?: string) => {
  const res = await api.get(`inventory/${id}`);
  return res.data.data;
};

export const createItem = async (item: CreateItem) => {
  const res = await api.post('/inventory', item);
  return res.data;
};

export const updateItem = async ({ id, item }: UpdateItemRequest) => {
  const res = await api.patch(`/inventory/${id}`, item);
  return res.data;
};

export const deleteItem = async (id: string) => {
  const res = await api.delete(`/inventory/${id}`);
  return res.data;
};
